from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # App Configuration
    APP_NAME: str = "EvolveLearn"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8081", "http://localhost:5173"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # Database Configuration
    DATABASE_URL: str = "postgresql://user:password@localhost/evolvelearn"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 30
    
    # Neo4j Configuration
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"
    NEO4J_DATABASE: str = "neo4j"
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("VITE_SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("VITE_SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY", "")
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("VITE_OPENAI_API_KEY", "")
    OPENAI_ORGANIZATION_ID: Optional[str] = os.getenv("VITE_OPENAI_ORGANIZATION_ID")
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_MAX_TOKENS: int = 4000
    OPENAI_TEMPERATURE: float = 0.7
    
    # Anthropic Configuration
    ANTHROPIC_API_KEY: str = os.getenv("VITE_ANTHROPIC_API_KEY", "")
    ANTHROPIC_MODEL: str = "claude-3-sonnet-20240229"
    ANTHROPIC_MAX_TOKENS: int = 4000
    
    # Google AI Configuration
    GOOGLE_AI_API_KEY: str = os.getenv("VITE_GOOGLE_AI_API_KEY", "")
    GOOGLE_AI_MODEL: str = "gemini-pro"
    
    # Azure OpenAI Configuration
    AZURE_OPENAI_API_KEY: str = os.getenv("VITE_AZURE_OPENAI_API_KEY", "")
    AZURE_OPENAI_ENDPOINT: str = os.getenv("VITE_AZURE_OPENAI_ENDPOINT", "")
    AZURE_OPENAI_MODEL: str = "gpt-4"
    
    # ElevenLabs Configuration
    ELEVENLABS_API_KEY: str = os.getenv("VITE_ELEVENLABS_API_KEY", "")
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"
    
    # AssemblyAI Configuration
    ASSEMBLYAI_API_KEY: str = os.getenv("VITE_ASSEMBLYAI_API_KEY", "")
    
    # Cohere Configuration
    COHERE_API_KEY: str = os.getenv("VITE_COHERE_API_KEY", "")
    COHERE_MODEL: str = "command"
    
    # Hugging Face Configuration
    HUGGINGFACE_API_KEY: str = os.getenv("VITE_HUGGINGFACE_API_KEY", "")
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Feature Flags
    ENABLE_AI_ASSISTANT: bool = True
    ENABLE_VOICE_MODE: bool = True
    ENABLE_VIDEO_MODE: bool = True
    ENABLE_DEMO_MODE: bool = True
    
    # AI Service Configuration
    AI_PROVIDER: str = "openai"  # openai, anthropic, google, azure
    AI_FALLBACK_PROVIDERS: List[str] = ["anthropic", "google"]
    
    # Study Room Configuration
    MAX_STUDY_ROOM_SIZE: int = 50
    STUDY_ROOM_TIMEOUT: int = 3600  # 1 hour in seconds
    
    # Notification Configuration
    ENABLE_EMAIL_NOTIFICATIONS: bool = True
    ENABLE_PUSH_NOTIFICATIONS: bool = True
    ENABLE_SMS_NOTIFICATIONS: bool = False
    
    # Security Configuration
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8081"]
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings() 