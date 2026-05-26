import asyncio
import websockets
import json

async def test_connection():
    uri = "ws://localhost:8000/ws/sala"
    try:
        print(f"Intentando conectar a {uri}...")
        async with websockets.connect(uri) as websocket:
            print("¡Conectado exitosamente desde Python!")
            
            payload = json.dumps({"action": "ping"})
            await websocket.send(payload)
            print("Ping enviado...")
            
            response = await websocket.recv()
            print(f"Respuesta del servidor: {response}")
            
    except Exception as e:
        print(f"Fallo la conexión: {e}")

asyncio.run(test_connection())