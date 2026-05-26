from urllib import response

import httpx
import base64
from core.config import ELEVENLABS_API_KEY, ELEVENLABS_BASE_URL

VOICE_MAP = {
    "normal": "XNqHpjKTB2N3VKCnuIQR",
    "tenebroso": "XNqHpjKTB2N3VKCnuIQR",
    "hackeado": "XNqHpjKTB2N3VKCnuIQR"
}

async def generate_creepy_voice(text: str, voice_type: str = "normal") -> str:
    if not ELEVENLABS_API_KEY:
        print("Advertencia: Faltan credenciales de ElevenLabs.")
        return ""

    voice_id = VOICE_MAP.get(voice_type, VOICE_MAP["normal"])
    print(f"Generando voz para texto: '{text}' con tipo de voz: '{voice_type} y voice_id: '{voice_id}'")

    url = f"{ELEVENLABS_BASE_URL}/{voice_id}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    estabilidad = 0.5 if voice_type == "normal" else 0.15
    estilo = 0.0 if voice_type == "normal" else 0.5

    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2", 
        "voice_settings": {
            "stability": estabilidad,   
            "similarity_boost": 0.9, 
            "style": estilo,          
            "use_speaker_boost": True
        }
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=data, headers=headers, timeout=10.0)

            if response.status_code != 200:
                print(f"Error de ElevenLabs: {response.status_code} - {response.text}")
                return ""
            
            audio_base64 = base64.b64encode(response.content).decode('utf-8')
            return audio_base64
            
        except httpx.HTTPError as exc:
            print(f"Error de red al conectar con ElevenLabs: {exc}")
            return ""
        except Exception as e:
            print(f"Error interno generando audio: {e}")
            return ""