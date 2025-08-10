from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from ..auth import verify_token

router = APIRouter()

# Pydantic models
class Question(BaseModel):
    id: str
    text: str
    type: str  # "multiple_choice", "true_false", "short_answer"
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: Optional[str] = None
    points: int = 1

class Quiz(BaseModel):
    id: str
    title: str
    description: str
    class_id: str
    time_limit: Optional[int] = None  # in minutes
    questions: List[Question]
    total_points: int

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: List[dict]  # List of {question_id: answer} pairs

class QuizResult(BaseModel):
    quiz_id: str
    score: int
    total_points: int
    percentage: float
    answers: List[dict]
    feedback: List[str]

# Mock quiz database
mock_quizzes = {
    "quiz1": {
        "id": "quiz1",
        "title": "AI Basics Quiz",
        "description": "Test your knowledge of AI fundamentals",
        "class_id": "class1",
        "time_limit": 30,
        "questions": [
            {
                "id": "q1",
                "text": "What does AI stand for?",
                "type": "multiple_choice",
                "options": ["Artificial Intelligence", "Automated Information", "Advanced Interface", "Applied Integration"],
                "correct_answer": "Artificial Intelligence",
                "explanation": "AI stands for Artificial Intelligence, which is the simulation of human intelligence in machines.",
                "points": 2
            },
            {
                "id": "q2",
                "text": "Machine learning is a subset of AI.",
                "type": "true_false",
                "correct_answer": "True",
                "explanation": "Machine learning is indeed a subset of artificial intelligence.",
                "points": 1
            }
        ],
        "total_points": 3
    }
}

# Mock quiz submissions
mock_submissions = {}

@router.get("/", response_model=List[Quiz])
async def get_quizzes(email: str = Depends(verify_token)):
    """Get all available quizzes"""
    return [Quiz(**quiz_data) for quiz_data in mock_quizzes.values()]

@router.get("/{quiz_id}", response_model=Quiz)
async def get_quiz(quiz_id: str, email: str = Depends(verify_token)):
    """Get a specific quiz by ID"""
    if quiz_id not in mock_quizzes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    return Quiz(**mock_quizzes[quiz_id])

@router.post("/", response_model=Quiz)
async def create_quiz(quiz_data: Quiz, email: str = Depends(verify_token)):
    """Create a new quiz"""
    # In a real app, check if user has instructor role
    quiz_id = f"quiz{len(mock_quizzes) + 1}"
    
    new_quiz = {
        **quiz_data.dict(),
        "id": quiz_id
    }
    
    mock_quizzes[quiz_id] = new_quiz
    
    return Quiz(**new_quiz)

@router.post("/{quiz_id}/submit", response_model=QuizResult)
async def submit_quiz(quiz_id: str, submission: QuizSubmission, email: str = Depends(verify_token)):
    """Submit answers for a quiz"""
    if quiz_id not in mock_quizzes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    quiz = mock_quizzes[quiz_id]
    score = 0
    feedback = []
    
    # Grade the quiz
    for question in quiz["questions"]:
        question_id = question["id"]
        student_answer = next((ans for ans in submission.answers if ans.get("question_id") == question_id), None)
        
        if student_answer and student_answer.get("answer") == question["correct_answer"]:
            score += question["points"]
            feedback.append(f"Question {question_id}: Correct! {question.get('explanation', '')}")
        else:
            feedback.append(f"Question {question_id}: Incorrect. Correct answer: {question['correct_answer']}")
    
    # Calculate percentage
    percentage = (score / quiz["total_points"]) * 100
    
    # Store submission
    submission_id = f"sub_{len(mock_submissions) + 1}"
    mock_submissions[submission_id] = {
        "id": submission_id,
        "quiz_id": quiz_id,
        "user_email": email,
        "answers": submission.answers,
        "score": score,
        "total_points": quiz["total_points"],
        "percentage": percentage,
        "feedback": feedback
    }
    
    return QuizResult(
        quiz_id=quiz_id,
        score=score,
        total_points=quiz["total_points"],
        percentage=percentage,
        answers=submission.answers,
        feedback=feedback
    )

@router.get("/{quiz_id}/results", response_model=List[QuizResult])
async def get_quiz_results(quiz_id: str, email: str = Depends(verify_token)):
    """Get results for a specific quiz"""
    if quiz_id not in mock_quizzes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    # In a real app, check if user has permission to view results
    results = [
        QuizResult(**submission) for submission in mock_submissions.values()
        if submission["quiz_id"] == quiz_id
    ]
    
    return results

@router.delete("/{quiz_id}")
async def delete_quiz(quiz_id: str, email: str = Depends(verify_token)):
    """Delete a quiz"""
    if quiz_id not in mock_quizzes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    # In a real app, check if user has permission to delete this quiz
    del mock_quizzes[quiz_id]
    
    return {"message": "Quiz deleted successfully"} 