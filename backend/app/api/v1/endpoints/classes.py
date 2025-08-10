from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from ..auth import verify_token

router = APIRouter()

# Pydantic models
class ClassContent(BaseModel):
    id: str
    title: str
    text: str
    order: int
    type: str = "text"

class ClassInfo(BaseModel):
    id: str
    title: str
    description: str
    instructor: str
    duration: str
    difficulty: str
    content: List[ClassContent]

class ClassCreate(BaseModel):
    title: str
    description: str
    instructor: str
    duration: str
    difficulty: str

# Mock classes database
mock_classes = {
    "class1": {
        "id": "class1",
        "title": "Introduction to AI",
        "description": "Learn the basics of artificial intelligence and machine learning",
        "instructor": "Dr. Smith",
        "duration": "8 weeks",
        "difficulty": "Beginner",
        "content": [
            {
                "id": "c1",
                "title": "What is AI?",
                "text": "Artificial Intelligence is the simulation of human intelligence in machines.",
                "order": 1,
                "type": "text"
            },
            {
                "id": "c2",
                "title": "Machine Learning Basics",
                "text": "Machine learning is a subset of AI that enables computers to learn without being explicitly programmed.",
                "order": 2,
                "type": "text"
            }
        ]
    },
    "class2": {
        "id": "class2",
        "title": "Advanced Mathematics",
        "description": "Deep dive into calculus, linear algebra, and statistics",
        "instructor": "Prof. Johnson",
        "duration": "12 weeks",
        "difficulty": "Advanced",
        "content": [
            {
                "id": "c1",
                "title": "Calculus Review",
                "text": "Review of differential and integral calculus concepts.",
                "order": 1,
                "type": "text"
            }
        ]
    }
}

@router.get("/", response_model=List[ClassInfo])
async def get_classes(email: str = Depends(verify_token)):
    """Get all available classes"""
    return [ClassInfo(**class_data) for class_data in mock_classes.values()]

@router.get("/{class_id}", response_model=ClassInfo)
async def get_class(class_id: str, email: str = Depends(verify_token)):
    """Get a specific class by ID"""
    if class_id not in mock_classes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    return ClassInfo(**mock_classes[class_id])

@router.post("/", response_model=ClassInfo)
async def create_class(class_data: ClassCreate, email: str = Depends(verify_token)):
    """Create a new class"""
    # In a real app, check if user has instructor role
    class_id = f"class{len(mock_classes) + 1}"
    
    new_class = {
        "id": class_id,
        **class_data.dict(),
        "content": []
    }
    
    mock_classes[class_id] = new_class
    
    return ClassInfo(**new_class)

@router.put("/{class_id}", response_model=ClassInfo)
async def update_class(class_id: str, class_data: ClassCreate, email: str = Depends(verify_token)):
    """Update an existing class"""
    if class_id not in mock_classes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # In a real app, check if user has permission to update this class
    updated_class = {
        **mock_classes[class_id],
        **class_data.dict()
    }
    
    mock_classes[class_id] = updated_class
    
    return ClassInfo(**updated_class)

@router.delete("/{class_id}")
async def delete_class(class_id: str, email: str = Depends(verify_token)):
    """Delete a class"""
    if class_id not in mock_classes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # In a real app, check if user has permission to delete this class
    del mock_classes[class_id]
    
    return {"message": "Class deleted successfully"}

@router.get("/{class_id}/content", response_model=List[ClassContent])
async def get_class_content(class_id: str, email: str = Depends(verify_token)):
    """Get content for a specific class"""
    if class_id not in mock_classes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    return mock_classes[class_id]["content"]

@router.post("/{class_id}/content", response_model=ClassContent)
async def add_class_content(class_id: str, content: ClassContent, email: str = Depends(verify_token)):
    """Add content to a class"""
    if class_id not in mock_classes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # In a real app, check if user has permission to add content
    mock_classes[class_id]["content"].append(content.dict())
    
    return content 