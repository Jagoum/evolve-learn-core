import asyncio
import logging
from typing import Dict, List, Any, Optional
import json
import openai
import anthropic
import google.generativeai as genai
from elevenlabs import generate, save, set_api_key
import assemblyai as aai
import cohere
from huggingface_hub import InferenceClient

from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        self.google_genai = None
        self.cohere_client = None
        self.hf_client = None
        self.current_provider = settings.AI_PROVIDER
        self.fallback_providers = settings.AI_FALLBACK_PROVIDERS
        
        # Initialize ElevenLabs
        if settings.ELEVENLABS_API_KEY:
            set_api_key(settings.ELEVENLABS_API_KEY)
            
        # Initialize AssemblyAI
        if settings.ASSEMBLYAI_API_KEY:
            aai.settings.api_key = settings.ASSEMBLYAI_API_KEY

    async def initialize(self):
        """Initialize AI service clients"""
        try:
            # Initialize OpenAI
            if settings.OPENAI_API_KEY:
                self.openai_client = openai.AsyncOpenAI(
                    api_key=settings.OPENAI_API_KEY,
                    organization=settings.OPENAI_ORGANIZATION_ID
                )
                logger.info("OpenAI client initialized")
            
            # Initialize Anthropic
            if settings.ANTHROPIC_API_KEY:
                self.anthropic_client = anthropic.AsyncAnthropic(
                    api_key=settings.ANTHROPIC_API_KEY
                )
                logger.info("Anthropic client initialized")
            
            # Initialize Google AI
            if settings.GOOGLE_AI_API_KEY:
                genai.configure(api_key=settings.GOOGLE_AI_API_KEY)
                self.google_genai = genai.GenerativeModel(settings.GOOGLE_AI_MODEL)
                logger.info("Google AI client initialized")
            
            # Initialize Cohere
            if settings.COHERE_API_KEY:
                self.cohere_client = cohere.AsyncClient(settings.COHERE_API_KEY)
                logger.info("Cohere client initialized")
            
            # Initialize Hugging Face
            if settings.HUGGINGFACE_API_KEY:
                self.hf_client = InferenceClient(
                    model="microsoft/DialoGPT-medium",
                    token=settings.HUGGINGFACE_API_KEY
                )
                logger.info("Hugging Face client initialized")
                
        except Exception as e:
            logger.error(f"Error initializing AI service: {e}")

    async def cleanup(self):
        """Cleanup AI service resources"""
        try:
            if self.openai_client:
                await self.openai_client.close()
            if self.anthropic_client:
                await self.anthropic_client.close()
            if self.cohere_client:
                await self.cohere_client.close()
        except Exception as e:
            logger.error(f"Error cleaning up AI service: {e}")

    async def generate_response(
        self, 
        prompt: str, 
        context: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> Dict[str, Any]:
        """Generate AI response with fallback providers"""
        providers = [self.current_provider] + self.fallback_providers
        
        for provider in providers:
            try:
                if provider == "openai" and self.openai_client:
                    return await self._generate_openai_response(prompt, context, max_tokens, temperature)
                elif provider == "anthropic" and self.anthropic_client:
                    return await self._generate_anthropic_response(prompt, context, max_tokens, temperature)
                elif provider == "google" and self.google_genai:
                    return await self._generate_google_response(prompt, context, max_tokens, temperature)
                elif provider == "cohere" and self.cohere_client:
                    return await self._generate_cohere_response(prompt, context, max_tokens, temperature)
            except Exception as e:
                logger.warning(f"Provider {provider} failed: {e}")
                continue
        
        # If all providers fail, return error
        return {
            "success": False,
            "error": "All AI providers are unavailable",
            "content": "I'm sorry, but I'm currently unable to process your request. Please try again later."
        }

    async def _generate_openai_response(
        self, 
        prompt: str, 
        context: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> Dict[str, Any]:
        """Generate response using OpenAI"""
        try:
            full_prompt = f"{context}\n\n{prompt}" if context else prompt
            
            response = await self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[{"role": "user", "content": full_prompt}],
                max_tokens=max_tokens or settings.OPENAI_MAX_TOKENS,
                temperature=temperature or settings.OPENAI_TEMPERATURE
            )
            
            return {
                "success": True,
                "provider": "openai",
                "content": response.choices[0].message.content,
                "usage": response.usage.dict() if response.usage else None
            }
        except Exception as e:
            logger.error(f"OpenAI error: {e}")
            raise

    async def _generate_anthropic_response(
        self, 
        prompt: str, 
        context: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> Dict[str, Any]:
        """Generate response using Anthropic"""
        try:
            full_prompt = f"{context}\n\n{prompt}" if context else prompt
            
            response = await self.anthropic_client.messages.create(
                model=settings.ANTHROPIC_MODEL,
                max_tokens=max_tokens or settings.ANTHROPIC_MAX_TOKENS,
                temperature=temperature or 0.7,
                messages=[{"role": "user", "content": full_prompt}]
            )
            
            return {
                "success": True,
                "provider": "anthropic",
                "content": response.content[0].text,
                "usage": None
            }
        except Exception as e:
            logger.error(f"Anthropic error: {e}")
            raise

    async def _generate_google_response(
        self, 
        prompt: str, 
        context: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> Dict[str, Any]:
        """Generate response using Google AI"""
        try:
            full_prompt = f"{context}\n\n{prompt}" if context else prompt
            
            response = await self.google_genai.generate_content_async(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=max_tokens or 4000,
                    temperature=temperature or 0.7
                )
            )
            
            return {
                "success": True,
                "provider": "google",
                "content": response.text,
                "usage": None
            }
        except Exception as e:
            logger.error(f"Google AI error: {e}")
            raise

    async def _generate_cohere_response(
        self, 
        prompt: str, 
        context: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> Dict[str, Any]:
        """Generate response using Cohere"""
        try:
            full_prompt = f"{context}\n\n{prompt}" if context else prompt
            
            response = await self.cohere_client.generate(
                model=settings.COHERE_MODEL,
                prompt=full_prompt,
                max_tokens=max_tokens or 4000,
                temperature=temperature or 0.7
            )
            
            return {
                "success": True,
                "provider": "cohere",
                "content": response.generations[0].text,
                "usage": None
            }
        except Exception as e:
            logger.error(f"Cohere error: {e}")
            raise

    async def moderate_content(self, content: str) -> Dict[str, Any]:
        """Moderate content using AI"""
        try:
            moderation_prompt = f"""
            Please analyze the following content and determine if it's appropriate for an educational platform.
            Content: {content}
            
            Respond with JSON format:
            {{
                "is_appropriate": true/false,
                "content": "cleaned_content_if_needed",
                "reason": "explanation_if_inappropriate",
                "severity": "low/medium/high"
            }}
            """
            
            response = await self.generate_response(moderation_prompt)
            
            if response["success"]:
                try:
                    # Try to parse JSON response
                    parsed = json.loads(response["content"])
                    return parsed
                except json.JSONDecodeError:
                    # If not JSON, use simple heuristic
                    inappropriate_words = ["hate", "violence", "discrimination", "harassment"]
                    is_appropriate = not any(word in content.lower() for word in inappropriate_words)
                    return {
                        "is_appropriate": is_appropriate,
                        "content": content,
                        "reason": "AI moderation unavailable, using basic filtering",
                        "severity": "low"
                    }
            else:
                # Fallback to basic filtering
                inappropriate_words = ["hate", "violence", "discrimination", "harassment"]
                is_appropriate = not any(word in content.lower() for word in inappropriate_words)
                return {
                    "is_appropriate": is_appropriate,
                    "content": content,
                    "reason": "AI moderation failed, using basic filtering",
                    "severity": "low"
                }
                
        except Exception as e:
            logger.error(f"Content moderation error: {e}")
            # Fallback to basic filtering
            inappropriate_words = ["hate", "violence", "discrimination", "harassment"]
            is_appropriate = not any(word in content.lower() for word in inappropriate_words)
            return {
                "is_appropriate": is_appropriate,
                "content": content,
                "reason": "Moderation service unavailable",
                "severity": "low"
            }

    async def generate_quiz_questions(
        self, 
        topic: str, 
        difficulty: str = "medium", 
        num_questions: int = 5
    ) -> Dict[str, Any]:
        """Generate quiz questions using AI"""
        try:
            prompt = f"""
            Generate {num_questions} multiple choice questions about {topic} at {difficulty} difficulty level.
            
            Format the response as JSON:
            {{
                "questions": [
                    {{
                        "question": "Question text",
                        "options": ["A", "B", "C", "D"],
                        "correct_answer": "A",
                        "explanation": "Why this is correct"
                    }}
                ]
            }}
            """
            
            response = await self.generate_response(prompt)
            
            if response["success"]:
                try:
                    parsed = json.loads(response["content"])
                    return {
                        "success": True,
                        "questions": parsed.get("questions", []),
                        "topic": topic,
                        "difficulty": difficulty
                    }
                except json.JSONDecodeError:
                    return {
                        "success": False,
                        "error": "Failed to parse AI response",
                        "questions": []
                    }
            else:
                return response
                
        except Exception as e:
            logger.error(f"Quiz generation error: {e}")
            return {
                "success": False,
                "error": str(e),
                "questions": []
            }

    async def text_to_speech(self, text: str, voice_id: Optional[str] = None) -> Dict[str, Any]:
        """Convert text to speech using ElevenLabs"""
        try:
            if not settings.ELEVENLABS_API_KEY:
                return {
                    "success": False,
                    "error": "ElevenLabs API key not configured"
                }
            
            voice = voice_id or settings.ELEVENLABS_VOICE_ID
            
            audio = generate(
                text=text,
                voice=voice,
                model="eleven_monolingual_v1"
            )
            
            # Save audio to file
            filename = f"tts_{hash(text)}.mp3"
            save(audio, filename)
            
            return {
                "success": True,
                "filename": filename,
                "voice": voice,
                "text": text
            }
            
        except Exception as e:
            logger.error(f"Text-to-speech error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def speech_to_text(self, audio_file: str) -> Dict[str, Any]:
        """Convert speech to text using AssemblyAI"""
        try:
            if not settings.ASSEMBLYAI_API_KEY:
                return {
                    "success": False,
                    "error": "AssemblyAI API key not configured"
                }
            
            config = aai.TranscriptionConfig(
                language_code="en",
                speaker_labels=True
            )
            
            transcript = aai.Transcriber().transcribe(audio_file, config)
            
            return {
                "success": True,
                "text": transcript.text,
                "confidence": transcript.confidence,
                "speakers": transcript.speaker_labels if transcript.speaker_labels else []
            }
            
        except Exception as e:
            logger.error(f"Speech-to-text error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def analyze_student_progress(
        self, 
        student_data: Dict[str, Any], 
        learning_objectives: List[str]
    ) -> Dict[str, Any]:
        """Analyze student progress and provide recommendations"""
        try:
            prompt = f"""
            Analyze the following student data and provide personalized learning recommendations:
            
            Student Data: {json.dumps(student_data, indent=2)}
            Learning Objectives: {json.dumps(learning_objectives, indent=2)}
            
            Provide analysis in JSON format:
            {{
                "progress_score": 0-100,
                "strengths": ["list of strengths"],
                "areas_for_improvement": ["list of areas"],
                "recommendations": ["list of recommendations"],
                "next_steps": ["list of next steps"],
                "estimated_completion_time": "estimated time to complete objectives"
            }}
            """
            
            response = await self.generate_response(prompt)
            
            if response["success"]:
                try:
                    parsed = json.loads(response["content"])
                    return {
                        "success": True,
                        "analysis": parsed
                    }
                except json.JSONDecodeError:
                    return {
                        "success": False,
                        "error": "Failed to parse AI analysis"
                    }
            else:
                return response
                
        except Exception as e:
            logger.error(f"Progress analysis error: {e}")
            return {
                "success": False,
                "error": str(e)
            } 