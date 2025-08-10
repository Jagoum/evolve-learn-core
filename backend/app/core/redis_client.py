import logging
import json
from redis.asyncio import Redis
from .config import settings

logger = logging.getLogger(__name__)

class RedisClient:
    def __init__(self):
        self.redis = None
        
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis = Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                encoding="utf-8"
            )
            # Test connection
            await self.redis.ping()
            logger.info("Redis connection established successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise
            
    async def close(self):
        """Close Redis connection"""
        if self.redis:
            await self.redis.close()
            logger.info("Redis connection closed successfully")
            
    async def set(self, key: str, value: any, expire: int = None):
        """Set a key-value pair"""
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        await self.redis.set(key, value, ex=expire)
        
    async def get(self, key: str):
        """Get a value by key"""
        value = await self.redis.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None
        
    async def delete(self, key: str):
        """Delete a key"""
        await self.redis.delete(key)
        
    async def exists(self, key: str):
        """Check if key exists"""
        return await self.redis.exists(key)

# Global instance
redis_client = RedisClient()

async def init_redis():
    """Initialize Redis connection"""
    await redis_client.connect()

async def close_redis():
    """Close Redis connection"""
    await redis_client.close() 