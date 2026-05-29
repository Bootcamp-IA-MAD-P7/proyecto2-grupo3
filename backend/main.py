import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

from backend.core.logger import logger
from backend.controllers import (
    cliente_controller,
    reserva_controller,
    sala_controller,
    sesion_controller,
)

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

app.include_router(cliente_controller.router)
app.include_router(reserva_controller.router)
app.include_router(sala_controller.router)
app.include_router(sesion_controller.router)
app.mount("/app", StaticFiles(directory="frontend", html=True), name="frontend")

# =====================================================================
# MANEJO GLOBAL DE ERRORES 
# =====================================================================
# --- MANEJADOR 1: Errores de Base de Datos (Por ejemplo: Email Duplicado) ---
@app.exception_handler(IntegrityError)
def integrity_error_handler(request: Request, exc: IntegrityError):
    # Se guarda en los logs internos del servidor el error técnico real
    logger.error(f"Error de integridad en BD en {request.method} {request.url.path}: {str(exc)}")
    
    # Se muestra mensaje de error al usuario sin mostrar ningún dato sensible
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Bad Request",
            "detail": "No se pudo procesar la solicitud. Es posible que el recurso ya exista o los datos asociados no sean válidos."
        }
    )

# --- MANEJADOR 2: Errores de Validación (Por ejemplo: Enviar texto en vez de número) ---
@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Se muestra en la consola del servidor mensaje de error de envió de datos con formato incorrecto
    logger.warning(f"Error de validación en datos de entrada en {request.method} {request.url.path}: {exc.errors()}")
    
    # Se devuelve un código 422 detallando el campo que tiene formato incorrecto
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


# --- MANEJADOR 3: Errores Inesperados (Cualquier bug o fallo del código en general) ---
@app.exception_handler(Exception)
def global_exception_handler(request: Request, exc: Exception):
    # Se registra un error CRÍTICO en consola con toda la traza del fallo (exc_info=True) para poder arreglarlo
    logger.critical(f"ERROR NO CONTROLADO en {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    
    # Se devuelve error 500 genérico
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
    # Dejamos traza en el log de que este endpoint se consultó
    logger.info("Health check ejecutado con éxito.")
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/app")
