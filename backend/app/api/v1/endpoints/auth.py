from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import jwt
from datetime import datetime, timedelta
from ...core.config import settings

router = APIRouter()
security = HTTPBearer()

# Pydantic models
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    role: str = "student"

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

# Mock user database (replace with actual database)
mock_users = {
    "user1@example.com": {
        "id": "user1",
        "email": "user1@example.com",
        "password": "hashed_password_1",
        "name": "John Doe",
        "role": "student",
        "created_at": "2024-01-01T00:00:00Z"
    }
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return email
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin):
    """User login endpoint"""
    user = mock_users.get(user_credentials.email)
    if not user or user_credentials.password != "password":  # Replace with actual password verification
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserRegister):
    """User registration endpoint"""
    if user_data.email in mock_users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user (in real app, hash password and save to database)
    new_user = {
        "id": f"user{len(mock_users) + 1}",
        "email": user_data.email,
        "password": "hashed_password",  # Hash password in real app
        "name": user_data.name,
        "role": user_data.role,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    
    mock_users[user_data.email] = new_user
    
    return UserResponse(**new_user)

@router.get("/me", response_model=UserResponse)
async def get_current_user(email: str = Depends(verify_token)):
    """Get current user information"""
    user = mock_users.get(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(**user)

@router.post("/logout")
async def logout():
    """User logout endpoint"""
    # In a real app, you might want to blacklist the token
    return {"message": "Successfully logged out"} 