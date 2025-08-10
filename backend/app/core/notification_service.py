import logging
from typing import Dict, Any
from .websocket_manager import websocket_manager

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.notification_types = {
            "achievement": self._send_achievement_notification,
            "reminder": self._send_reminder_notification,
            "progress": self._send_progress_notification,
            "system": self._send_system_notification
        }
        
    async def send_notification(self, user_id: str, notification_type: str, data: Dict[str, Any]):
        """Send a notification to a specific user"""
        try:
            if notification_type in self.notification_types:
                await self.notification_types[notification_type](user_id, data)
            else:
                logger.warning(f"Unknown notification type: {notification_type}")
        except Exception as e:
            logger.error(f"Error sending notification to user {user_id}: {e}")
            
    async def send_achievement_notification(self, user_id: str):
        """Send achievement notification"""
        notification = {
            "type": "achievement",
            "title": "Achievement Unlocked!",
            "message": "Congratulations on your progress!",
            "timestamp": "now"
        }
        await websocket_manager.send_personal_message(user_id, {
            "type": "notification",
            "data": notification
        })
        
    async def send_reminder_notification(self, user_id: str):
        """Send reminder notification"""
        notification = {
            "type": "reminder",
            "title": "Study Reminder",
            "message": "Time to continue your learning journey!",
            "timestamp": "now"
        }
        await websocket_manager.send_personal_message(user_id, {
            "type": "notification",
            "data": notification
        })
        
    async def send_progress_notification(self, user_id: str):
        """Send progress notification"""
        notification = {
            "type": "progress",
            "title": "Progress Update",
            "message": "You've made great progress today!",
            "timestamp": "now"
        }
        await websocket_manager.send_personal_message(user_id, {
            "type": "notification",
            "data": notification
        })
        
    async def send_system_notification(self, user_id: str, message: str):
        """Send system notification"""
        notification = {
            "type": "system",
            "title": "System Message",
            "message": message,
            "timestamp": "now"
        }
        await websocket_manager.send_personal_message(user_id, {
            "type": "notification",
            "data": notification
        })
        
    async def broadcast_notification(self, notification_type: str, data: Dict[str, Any]):
        """Broadcast notification to all users"""
        try:
            if notification_type in self.notification_types:
                await websocket_manager.broadcast_to_all({
                    "type": "notification",
                    "data": data
                })
        except Exception as e:
            logger.error(f"Error broadcasting notification: {e}") 