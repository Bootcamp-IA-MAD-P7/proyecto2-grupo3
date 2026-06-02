from pydantic import BaseModel
from typing import Optional

class GameMasterRequest(BaseModel):
    action: str  
    text: Optional[str] = None
    voice_type: Optional[str] = "default"

class RoomEventResponse(BaseModel):
    event_type: str
    text_display: str
    audio_base64: Optional[str] = None
    voice_type: str = "normal"