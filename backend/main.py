# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers import game_controller

app = FastAPI(title="API Escape Room - Gestión y WebSockets")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "microservicio": "escape_room_engine"}

app.include_router(game_controller.router)