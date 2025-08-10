import logging
from neo4j import AsyncGraphDatabase
from .config import settings

logger = logging.getLogger(__name__)

class Neo4jClient:
    def __init__(self):
        self.driver = None
        
    async def connect(self):
        """Connect to Neo4j database"""
        try:
            self.driver = AsyncGraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
            )
            # Test connection
            await self.driver.verify_connectivity()
            logger.info("Neo4j connection established successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            raise
            
    async def close(self):
        """Close Neo4j connection"""
        if self.driver:
            await self.driver.close()
            logger.info("Neo4j connection closed successfully")
            
    async def execute_query(self, query: str, parameters: dict = None):
        """Execute a Cypher query"""
        if not self.driver:
            raise Exception("Neo4j not connected")
            
        async with self.driver.session() as session:
            result = await session.run(query, parameters or {})
            return await result.data()

# Global instance
neo4j_client = Neo4jClient()

async def init_neo4j():
    """Initialize Neo4j connection"""
    await neo4j_client.connect()

async def close_neo4j():
    """Close Neo4j connection"""
    await neo4j_client.close() 