from fastapi import APIRouter
from .endpoints import auth, classes, quiz, study_room, ai

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(classes.router, prefix="/classes", tags=["classes"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
api_router.include_router(study_room.router, prefix="/study-room", tags=["study-room"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"]) 