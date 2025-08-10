from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import asyncio
import json
import logging
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

from backend.app.core.config import settings
from app.core.database import init_db, close_db
from app.core.neo4j_client import init_neo4j, close_neo4j
from app.core.redis_client import init_redis, close_redis
from app.api.v1.api import api_router
from app.core.websocket_manager import WebSocketManager
from app.core.notification_service import NotificationService
from app.core.ai_service import AIService
from app.core.study_room_service import StudyRoomService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global instances
websocket_manager = WebSocketManager()
notification_service = NotificationService()
ai_service = AIService()
study_room_service = StudyRoomService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up EvolveLearn API...")
    await init_db()
    await init_neo4j()
    await init_redis()
    await ai_service.initialize()
    logger.info("EvolveLearn API started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down EvolveLearn API...")
    await close_db()
    await close_neo4j()
    await close_redis()
    await ai_service.cleanup()
    logger.info("EvolveLearn API shut down successfully")

app = FastAPI(
    title="EvolveLearn API",
    description="AI-Powered Learning Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# WebSocket endpoint for real-time communication
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket_manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message["type"] == "chat":
                await handle_chat_message(user_id, message)
            elif message["type"] == "study_room_join":
                await handle_study_room_join(user_id, message)
            elif message["type"] == "study_room_leave":
                await handle_study_room_leave(user_id, message)
            elif message["type"] == "notification":
                await handle_notification(user_id, message)
                
    except WebSocketDisconnect:
        await websocket_manager.disconnect(user_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket_manager.disconnect(user_id)

async def handle_chat_message(user_id: str, message: Dict[str, Any]):
    """Handle chat messages and broadcast to relevant users"""
    try:
        # Process message through AI service for content moderation
        moderated_content = await ai_service.moderate_content(message["content"])
        
        if moderated_content["is_appropriate"]:
            # Store message in database
            chat_message = {
                "sender_id": user_id,
                "content": moderated_content["content"],
                "room_id": message.get("room_id"),
                "timestamp": message.get("timestamp"),
                "message_type": message.get("message_type", "text")
            }
            
            # Broadcast to relevant users
            await websocket_manager.broadcast_to_room(
                message.get("room_id", "global"),
                {
                    "type": "chat_message",
                    "data": chat_message
                }
            )
            
            # Update Neo4j with user interaction data
            await study_room_service.record_user_interaction(
                user_id, 
                message.get("room_id"), 
                "chat_message"
            )
        else:
            # Send moderation warning to user
            await websocket_manager.send_personal_message(
                user_id,
                {
                    "type": "moderation_warning",
                    "message": "Your message was flagged as inappropriate."
                }
            )
            
    except Exception as e:
        logger.error(f"Error handling chat message: {e}")

async def handle_study_room_join(user_id: str, message: Dict[str, Any]):
    """Handle user joining a study room"""
    try:
        room_id = message["room_id"]
        await study_room_service.add_user_to_room(user_id, room_id)
        
        # Notify other users in the room
        await websocket_manager.broadcast_to_room(
            room_id,
            {
                "type": "user_joined",
                "user_id": user_id,
                "room_id": room_id
            },
            exclude_user=user_id
        )
        
        # Send room info to joining user
        room_info = await study_room_service.get_room_info(room_id)
        await websocket_manager.send_personal_message(
            user_id,
            {
                "type": "room_info",
                "data": room_info
            }
        )
        
    except Exception as e:
        logger.error(f"Error handling study room join: {e}")

async def handle_study_room_leave(user_id: str, message: Dict[str, Any]):
    """Handle user leaving a study room"""
    try:
        room_id = message["room_id"]
        await study_room_service.remove_user_from_room(user_id, room_id)
        
        # Notify other users in the room
        await websocket_manager.broadcast_to_room(
            room_id,
            {
                "type": "user_left",
                "user_id": user_id,
                "room_id": room_id
            }
        )
        
    except Exception as e:
        logger.error(f"Error handling study room leave: {e}")

async def handle_notification(user_id: str, message: Dict[str, Any]):
    """Handle notification requests"""
    try:
        notification_type = message["notification_type"]
        target_user = message.get("target_user", user_id)
        
        if notification_type == "achievement":
            await notification_service.send_achievement_notification(target_user)
        elif notification_type == "reminder":
            await notification_service.send_reminder_notification(target_user)
        elif notification_type == "progress":
            await notification_service.send_progress_notification(target_user)
            
    except Exception as e:
        logger.error(f"Error handling notification: {e}")

@app.get("/")
async def root():
    return {
        "message": "EvolveLearn API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "neo4j": "connected",
            "redis": "connected",
            "ai_service": "initialized"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 