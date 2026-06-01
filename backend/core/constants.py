from enum import Enum

class WebsocketAction(str, Enum):
    SEND_HINT = "send_hint"
    PAUSE_TIMER = "pause_timer"
    PING = "ping"

class RoomEvent(str, Enum):
    HINT_RECEIVED = "hint_received"

    