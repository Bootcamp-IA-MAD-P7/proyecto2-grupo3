// models/EscapeRoom.ts

export interface GameMasterRequest {
  action: 'send_hint' | 'pause_timer';
  text?: string;
  voice_type?: string;
}

export interface RoomEventResponse {
  event_type: 'hint_received' | 'timer_paused';
  text_display: string;
  audio_base64?: string;
  voice_type?: string;
}