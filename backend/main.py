import time
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware

from core.logger import logger
from routers import (
    cliente_router,
    disponibilidad_router,
    empleado_router,
    reserva_router,
    sala_router,
    sesion_router,
    game_router
)
from routers import auth_router

# =====================================================================
# EVENTOS DEL CICLO DE VIDA DE LA API
# =====================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Iniciando...")
    yield  # Aquí es donde la API se queda "viva" y escuchando peticiones
    logger.warning("Finalizando...")

# =====================================================================
# INICIALIZACIÓN DE LA API
# =====================================================================
app = FastAPI(
    title="Escape Rooms API",
    description="API REST para la gestion de un negocio de escape rooms",
    version="1.0.0",
    lifespan=lifespan  # Le indicamos a FastAPI que use nuestro gestor de ciclo de vida
)

# =====================================================================
# CONFIGURACIÓN DE CORS (Cross-Origin Resource Sharing)
# =====================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite CUALQUIER frontend
    allow_credentials=False, # Si usas "*", esto DEBE ser False obligatoriamente
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cliente_router.router, prefix="/api")
app.include_router(disponibilidad_router.router, prefix="/api")
app.include_router(empleado_router.router, prefix="/api")
app.include_router(reserva_router.router, prefix="/api")
app.include_router(sala_router.router, prefix="/api")
app.include_router(sesion_router.router, prefix="/api")
app.include_router(game_router.router, prefix="/api")
app.include_router(auth_router.router, prefix="/api")

# =====================================================================
# [MIGRACIÓN A NIVEL EXPERTO] - Desacoplamiento del Frontend
# El código a continuación (Nivel Esencial) montaba los estáticos en el backend.
# Se ha comentado para migrar la arquitectura a un frontend SPA (React/Vite) independiente,
# permitiendo escalabilidad y comunicación bidireccional (WebSockets).
# =====================================================================
# backend_dir = os.path.dirname(os.path.abspath(__file__))
# wwwroot_dir = os.path.dirname(backend_dir)
# frontend_dir = os.path.join(wwwroot_dir, "frontend")
# if os.path.exists(frontend_dir):
#     app.mount("/app", StaticFiles(directory=frontend_dir, html=True), name="frontend")


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time

    logger.info(
        "%s %s - %s - %.3fs",
        request.method,
        request.url.path,
        response.status_code,
        process_time,
    )

    return response

# =====================================================================
# MANEJO GLOBAL DE ERRORES 
# =====================================================================
@app.exception_handler(IntegrityError)
def integrity_error_handler(request: Request, exc: IntegrityError):
    logger.error(f"Error de integridad en BD en {request.method} {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Bad Request",
            "detail": "No se pudo procesar la solicitud. Es posible que el recurso ya exista o los datos asociados no sean válidos."
        }
    )

@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Error de validación en datos de entrada en {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Unprocessable Entity",
            "detail": "Los datos enviados no tienen el formato correcto.",
            "fields": [
                {
                    "loc": list(err["loc"]),
                    "msg": str(err["msg"]),
                    "type": str(err["type"]),
                }
                for err in exc.errors()
            ]
        }
    )

@app.exception_handler(Exception)
def global_exception_handler(request: Request, exc: Exception):
    logger.critical(f"ERROR NO CONTROLADO en {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "detail": "Ha ocurrido un error interno en el servidor. Por favor, contacte al administrador."
        }
    )

# =====================================================================
# 4. RUTAS DE LA API
# =====================================================================
@app.get("/health", tags=["Health"])
def health_check():
    logger.info("Health check ejecutado con éxito.")
    return {"status": "ok"}

# =====================================================================
# [MIGRACIÓN A NIVEL EXPERTO] - Comentado por desacoplamiento
# =====================================================================
# @app.get("/", include_in_schema=False)
# def root():
#     return RedirectResponse(url="/app")