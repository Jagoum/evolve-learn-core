import json
import logging
from typing import Dict, Set, Any
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.room_connections: Dict[str, Set[str]] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        """Connect a user's WebSocket"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"User {user_id} connected to WebSocket")
        
    async def disconnect(self, user_id: str):
        """Disconnect a user's WebSocket"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            
        # Remove from all rooms
        for room_id in list(self.room_connections.keys()):
            if user_id in self.room_connections[room_id]:
                self.room_connections[room_id].discard(user_id)
                if not self.room_connections[room_id]:
                    del self.room_connections[room_id]
                    
        logger.info(f"User {user_id} disconnected from WebSocket")
        
    async def join_room(self, user_id: str, room_id: str):
        """Add a user to a room"""
        if room_id not in self.room_connections:
            self.room_connections[room_id] = set()
        self.room_connections[room_id].add(user_id)
        logger.info(f"User {user_id} joined room {room_id}")
        
    async def leave_room(self, user_id: str, room_id: str):
        """Remove a user from a room"""
        if room_id in self.room_connections:
            self.room_connections[room_id].discard(user_id)
            if not self.room_connections[room_id]:
                del self.room_connections[room_id]
        logger.info(f"User {user_id} left room {room_id}")
        
    async def send_personal_message(self, user_id: str, message: Dict[str, Any]):
        """Send a message to a specific user"""
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error sending message to user {user_id}: {e}")
                await self.disconnect(user_id)
                
    async def broadcast_to_room(self, room_id: str, message: Dict[str, Any], exclude_user: str = None):
        """Broadcast a message to all users in a room"""
        if room_id not in self.room_connections:
            return
            
        disconnected_users = set()
        for user_id in self.room_connections[room_id]:
            if user_id != exclude_user and user_id in self.active_connections:
                try:
                    await self.active_connections[user_id].send_text(json.dumps(message))
                except Exception as e:
                    logger.error(f"Error broadcasting to user {user_id}: {e}")
                    disconnected_users.add(user_id)
                    
        # Clean up disconnected users
        for user_id in disconnected_users:
            await self.disconnect(user_id)
            
    async def broadcast_to_all(self, message: Dict[str, Any]):
        """Broadcast a message to all connected users"""
        disconnected_users = set()
        for user_id, websocket in self.active_connections.items():
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to user {user_id}: {e}")
                disconnected_users.add(user_id)
                
        # Clean up disconnected users
        for user_id in disconnected_users:
            await self.disconnect(user_id) 