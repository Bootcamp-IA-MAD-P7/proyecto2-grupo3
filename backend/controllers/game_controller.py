from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.ws_manager import manager
from services.elevenlabs_service import generate_creepy_voice
from core.constants import WebsocketAction, RoomEvent
from schemas.messages import GameMasterRequest, RoomEventResponse
import json
from pydantic import ValidationError

router = APIRouter()

@router.websocket("/ws/sala")
async def escape_room_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            raw_data = await websocket.receive_text()
            data_dict = json.loads(raw_data)
            
            try:
                payload = GameMasterRequest(**data_dict)
                
                if payload.action == WebsocketAction.PING:
                    await websocket.send_text('{"event_type": "pong"}')
                    continue

                if payload.action == WebsocketAction.SEND_HINT:
                    audio_b64 = await generate_creepy_voice(payload.text, payload.voice_type)
                    
                    response = RoomEventResponse(
                        event_type=RoomEvent.HINT_RECEIVED,
                        text_display=payload.text,
                        audio_base64=audio_b64,
                        voice_type=payload.voice_type
                    )
                    
                    await manager.broadcast(response.model_dump_json())
                    
            except ValidationError as e:
                print(f"Error de validación del payload: {e}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)