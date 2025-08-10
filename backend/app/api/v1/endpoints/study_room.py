from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from ...core.study_room_service import StudyRoomService
from ...core.websocket_manager import websocket_manager
from ..auth import verify_token

router = APIRouter()
study_room_service = StudyRoomService()

# Pydantic models
class StudyRoomCreate(BaseModel):
    name: str
    description: Optional[str] = None
    max_users: Optional[int] = 10
    is_private: bool = False

class StudyRoomInfo(BaseModel):
    id: str
    name: str
    description: Optional[str]
    max_users: int
    is_private: bool
    users: List[str]
    created_at: str

class ChatMessage(BaseModel):
    content: str
    message_type: str = "text"
    room_id: str

class UserJoin(BaseModel):
    room_id: str

class UserLeave(BaseModel):
    room_id: str

@router.post("/", response_model=StudyRoomInfo)
async def create_study_room(room_data: StudyRoomCreate, email: str = Depends(verify_token)):
    """Create a new study room"""
    try:
        room_id = f"room_{len(study_room_service.active_rooms) + 1}"
        success = await study_room_service.create_room(room_id, room_data.dict())
        
        if success:
            room_info = await study_room_service.get_room_info(room_id)
            return StudyRoomInfo(**room_info)
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create study room"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=List[StudyRoomInfo])
async def get_study_rooms(email: str = Depends(verify_token)):
    """Get all available study rooms"""
    try:
        rooms = []
        for room_id in study_room_service.active_rooms:
            room_info = await study_room_service.get_room_info(room_id)
            if room_info:
                rooms.append(StudyRoomInfo(**room_info))
        return rooms
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{room_id}", response_model=StudyRoomInfo)
async def get_study_room(room_id: str, email: str = Depends(verify_token)):
    """Get information about a specific study room"""
    try:
        room_info = await study_room_service.get_room_info(room_id)
        if not room_info:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Study room not found"
            )
        return StudyRoomInfo(**room_info)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/join")
async def join_study_room(join_data: UserJoin, email: str = Depends(verify_token)):
    """Join a study room"""
    try:
        success = await study_room_service.add_user_to_room(email, join_data.room_id)
        if success:
            return {"message": f"Successfully joined room {join_data.room_id}"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to join study room"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/leave")
async def leave_study_room(leave_data: UserLeave, email: str = Depends(verify_token)):
    """Leave a study room"""
    try:
        success = await study_room_service.remove_user_from_room(email, leave_data.room_id)
        if success:
            return {"message": f"Successfully left room {leave_data.room_id}"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to leave study room"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/user/{user_id}/rooms", response_model=List[StudyRoomInfo])
async def get_user_rooms(user_id: str, email: str = Depends(verify_token)):
    """Get all rooms a user is part of"""
    try:
        # In a real app, check if user has permission to view other users' rooms
        rooms = await study_room_service.get_user_rooms(user_id)
        return [StudyRoomInfo(**room) for room in rooms]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{room_id}")
async def delete_study_room(room_id: str, email: str = Depends(verify_token)):
    """Delete a study room"""
    try:
        # In a real app, check if user has permission to delete this room
        if room_id in study_room_service.active_rooms:
            del study_room_service.active_rooms[room_id]
            return {"message": "Study room deleted successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Study room not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 