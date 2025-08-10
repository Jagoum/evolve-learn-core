import logging
from typing import Dict, Any, List
from .websocket_manager import websocket_manager
from .neo4j_client import neo4j_client

logger = logging.getLogger(__name__)

class StudyRoomService:
    def __init__(self):
        self.active_rooms = {}
        
    async def create_room(self, room_id: str, room_data: Dict[str, Any]):
        """Create a new study room"""
        try:
            self.active_rooms[room_id] = {
                "id": room_id,
                "users": set(),
                "data": room_data,
                "created_at": "now"
            }
            
            # Create room in Neo4j
            query = """
            CREATE (r:StudyRoom {id: $room_id, name: $name, created_at: $created_at})
            """
            await neo4j_client.execute_query(query, {
                "room_id": room_id,
                "name": room_data.get("name", "Study Room"),
                "created_at": "now"
            })
            
            logger.info(f"Study room {room_id} created successfully")
            return True
        except Exception as e:
            logger.error(f"Error creating study room {room_id}: {e}")
            return False
            
    async def add_user_to_room(self, user_id: str, room_id: str):
        """Add a user to a study room"""
        try:
            if room_id not in self.active_rooms:
                await self.create_room(room_id, {"name": f"Room {room_id}"})
                
            self.active_rooms[room_id]["users"].add(user_id)
            await websocket_manager.join_room(user_id, room_id)
            
            # Record user-room relationship in Neo4j
            query = """
            MATCH (u:User {id: $user_id})
            MATCH (r:StudyRoom {id: $room_id})
            MERGE (u)-[:JOINED_ROOM]->(r)
            """
            await neo4j_client.execute_query(query, {
                "user_id": user_id,
                "room_id": room_id
            })
            
            logger.info(f"User {user_id} added to room {room_id}")
            return True
        except Exception as e:
            logger.error(f"Error adding user {user_id} to room {room_id}: {e}")
            return False
            
    async def remove_user_from_room(self, user_id: str, room_id: str):
        """Remove a user from a study room"""
        try:
            if room_id in self.active_rooms:
                self.active_rooms[room_id]["users"].discard(user_id)
                await websocket_manager.leave_room(user_id, room_id)
                
                # Remove user-room relationship in Neo4j
                query = """
                MATCH (u:User {id: $user_id})-[r:JOINED_ROOM]->(room:StudyRoom {id: $room_id})
                DELETE r
                """
                await neo4j_client.execute_query(query, {
                    "user_id": user_id,
                    "room_id": room_id
                })
                
            logger.info(f"User {user_id} removed from room {room_id}")
            return True
        except Exception as e:
            logger.error(f"Error removing user {user_id} from room {room_id}: {e}")
            return False
            
    async def get_room_info(self, room_id: str):
        """Get information about a study room"""
        try:
            if room_id in self.active_rooms:
                room = self.active_rooms[room_id].copy()
                room["users"] = list(room["users"])
                return room
            return None
        except Exception as e:
            logger.error(f"Error getting room info for {room_id}: {e}")
            return None
            
    async def record_user_interaction(self, user_id: str, room_id: str, interaction_type: str):
        """Record user interaction in Neo4j"""
        try:
            query = """
            MATCH (u:User {id: $user_id})
            MATCH (r:StudyRoom {id: $room_id})
            CREATE (i:Interaction {
                type: $interaction_type,
                timestamp: $timestamp,
                user_id: $user_id,
                room_id: $room_id
            })
            CREATE (u)-[:PERFORMED]->(i)
            CREATE (i)-[:IN_ROOM]->(r)
            """
            await neo4j_client.execute_query(query, {
                "user_id": user_id,
                "room_id": room_id,
                "interaction_type": interaction_type,
                "timestamp": "now"
            })
            
            logger.info(f"Recorded {interaction_type} interaction for user {user_id} in room {room_id}")
        except Exception as e:
            logger.error(f"Error recording user interaction: {e}")
            
    async def get_user_rooms(self, user_id: str):
        """Get all rooms a user is part of"""
        try:
            query = """
            MATCH (u:User {id: $user_id})-[:JOINED_ROOM]->(r:StudyRoom)
            RETURN r
            """
            result = await neo4j_client.execute_query(query, {"user_id": user_id})
            return [room["r"] for room in result]
        except Exception as e:
            logger.error(f"Error getting user rooms for {user_id}: {e}")
            return [] 