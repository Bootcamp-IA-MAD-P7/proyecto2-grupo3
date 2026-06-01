import asyncio
import json
from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_rooms: Dict[int, List[WebSocket]] = {}
        self.room_tasks: Dict[int, asyncio.Task] = {}
        self.room_time: Dict[int, int] = {}

    async def connect(self, websocket: WebSocket, sala_id: int):
        await websocket.accept()
        if sala_id not in self.active_rooms:
            self.active_rooms[sala_id] = []
        self.active_rooms[sala_id].append(websocket)
        
        if sala_id in self.room_time:
            await websocket.send_text(json.dumps({
                "event_type": "time_sync",
                "time_left": self.room_time[sala_id]
            }))

    def disconnect(self, websocket: WebSocket, sala_id: int):
        if sala_id in self.active_rooms:
            if websocket in self.active_rooms[sala_id]:
                self.active_rooms[sala_id].remove(websocket)
            if not self.active_rooms[sala_id]:
                del self.active_rooms[sala_id]

    async def broadcast_to_room(self, message: str, sala_id: int):
        if sala_id in self.active_rooms:
            for connection in list(self.active_rooms[sala_id]):
                try:
                    await connection.send_text(message)
                except Exception:
                    self.disconnect(connection, sala_id)

    def start_timer(self, sala_id: int, duration_seconds: int = 3600):
        if sala_id in self.room_tasks:
            self.room_tasks[sala_id].cancel()
        
        self.room_time[sala_id] = duration_seconds
        task = asyncio.create_task(self._timer_task(sala_id))
        self.room_tasks[sala_id] = task

    async def _timer_task(self, sala_id: int):
        try:
            while self.room_time.get(sala_id, 0) > 0:
                await asyncio.sleep(1) 
                self.room_time[sala_id] -= 1
                
                await self.broadcast_to_room(json.dumps({
                    "event_type": "time_sync",
                    "time_left": self.room_time[sala_id]
                }), sala_id)

            await self.broadcast_to_room(json.dumps({
                "event_type": "game_over"
            }), sala_id)
            
            if sala_id in self.active_rooms:
                for connection in list(self.active_rooms[sala_id]):
                    try:
                        await connection.close()
                    except:
                        pass
                del self.active_rooms[sala_id]
                
        except asyncio.CancelledError:
            pass
        finally:
            if sala_id in self.room_time:
                del self.room_time[sala_id]
            if sala_id in self.room_tasks:
                del self.room_tasks[sala_id]

manager = ConnectionManager()