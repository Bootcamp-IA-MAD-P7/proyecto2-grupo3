from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.ws_manager import manager
from services.elevenlabs_service import generate_creepy_voice
from core.constants import WebsocketAction, RoomEvent
from schemas.messages import GameMasterRequest, RoomEventResponse
import json
from pydantic import ValidationError

router = APIRouter()

@router.post("/juego/iniciar/{sala_id}")
async def iniciar_juego(sala_id: int):
    manager.start_timer(sala_id, duration_seconds=3600)
    return {"mensaje": f"El tiempo corre para la sala {sala_id}", "tiempo_total": 3600}

@router.post("/juego/parar/{sala_id}")
async def parar_juego(sala_id: int):
    manager.stop_timer(sala_id)
    await manager.broadcast_to_room(json.dumps({"event_type": "game_over"}), sala_id)
    return {"mensaje": f"Timer detenido y reseteado para la sala {sala_id}"}

@router.websocket("/ws/sala/{sala_id}")
async def escape_room_endpoint(websocket: WebSocket, sala_id: int):
    await manager.connect(websocket, sala_id)
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
                    audio_b64 = await generate_creepy_voice(payload.text, getattr(payload, 'voice_type', 'normal'))
                    
                    response = {
                        "event_type": RoomEvent.HINT_RECEIVED,
                        "text_display": payload.text,
                        "audio_base64": audio_b64,
                        "voice_type": getattr(payload, 'voice_type', 'normal')
                    }
                    
                    await manager.broadcast_to_room(json.dumps(response), sala_id)
                    
            except ValidationError as e:
                print(f"Error de validación del payload: {e}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, sala_id)