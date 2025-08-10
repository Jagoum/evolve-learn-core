from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from ...core.ai_service import AIService
from ..auth import verify_token

router = APIRouter()
ai_service = AIService()

# Pydantic models
class ContentGenerationRequest(BaseModel):
    prompt: str
    content_type: str  # "lesson", "quiz", "explanation", "summary"
    difficulty: str = "intermediate"
    max_length: Optional[int] = 500

class ContentGenerationResponse(BaseModel):
    content: str
    metadata: dict
    tokens_used: int

class ContentModerationRequest(BaseModel):
    content: str
    content_type: str = "text"

class ContentModerationResponse(BaseModel):
    is_appropriate: bool
    content: str
    flags: List[str]
    confidence: float

class LearningPathRequest(BaseModel):
    user_id: str
    subject: str
    current_level: str
    goals: List[str]

class LearningPathResponse(BaseModel):
    path: List[dict]
    estimated_duration: str
    difficulty_progression: List[str]

@router.post("/generate", response_model=ContentGenerationResponse)
async def generate_content(request: ContentGenerationRequest, email: str = Depends(verify_token)):
    """Generate AI-powered educational content"""
    try:
        # In a real app, you might want to check user permissions and rate limits
        result = await ai_service.generate_content(
            prompt=request.prompt,
            content_type=request.content_type,
            difficulty=request.difficulty,
            max_length=request.max_length
        )
        
        if result:
            return ContentGenerationResponse(
                content=result.get("content", ""),
                metadata=result.get("metadata", {}),
                tokens_used=result.get("tokens_used", 0)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate content"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/moderate", response_model=ContentModerationResponse)
async def moderate_content(request: ContentModerationRequest, email: str = Depends(verify_token)):
    """Moderate content for appropriateness"""
    try:
        result = await ai_service.moderate_content(
            content=request.content,
            content_type=request.content_type
        )
        
        if result:
            return ContentModerationResponse(
                is_appropriate=result.get("is_appropriate", True),
                content=result.get("content", request.content),
                flags=result.get("flags", []),
                confidence=result.get("confidence", 1.0)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to moderate content"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/learning-path", response_model=LearningPathResponse)
async def generate_learning_path(request: LearningPathRequest, email: str = Depends(verify_token)):
    """Generate a personalized learning path"""
    try:
        result = await ai_service.generate_learning_path(
            user_id=request.user_id,
            subject=request.subject,
            current_level=request.current_level,
            goals=request.goals
        )
        
        if result:
            return LearningPathResponse(
                path=result.get("path", []),
                estimated_duration=result.get("estimated_duration", "Unknown"),
                difficulty_progression=result.get("difficulty_progression", [])
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate learning path"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/explain")
async def explain_concept(request: ContentGenerationRequest, email: str = Depends(verify_token)):
    """Get AI explanation of a concept"""
    try:
        result = await ai_service.explain_concept(
            concept=request.prompt,
            difficulty=request.difficulty,
            max_length=request.max_length
        )
        
        if result:
            return {
                "explanation": result.get("explanation", ""),
                "examples": result.get("examples", []),
                "related_concepts": result.get("related_concepts", [])
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate explanation"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/quiz-generation")
async def generate_quiz(request: ContentGenerationRequest, email: str = Depends(verify_token)):
    """Generate AI-powered quiz questions"""
    try:
        result = await ai_service.generate_quiz(
            topic=request.prompt,
            difficulty=request.difficulty,
            question_count=5
        )
        
        if result:
            return {
                "questions": result.get("questions", []),
                "difficulty": result.get("difficulty", request.difficulty),
                "estimated_time": result.get("estimated_time", "10 minutes")
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate quiz"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/health")
async def ai_service_health():
    """Check AI service health"""
    try:
        status = await ai_service.get_service_status()
        return {
            "status": "healthy",
            "service": "ai",
            "details": status
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "ai",
            "error": str(e)
        } 