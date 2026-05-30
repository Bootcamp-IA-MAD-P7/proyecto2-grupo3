import logging
import sys

# =====================================================================
# CONFIGURACIÓN DE LOGGING
# =====================================================================
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

logging.basicConfig(
    level=logging.INFO,  # Captura INFO, WARNING, ERROR y CRITICAL
    format=LOG_FORMAT,
    handlers=[
        logging.StreamHandler(sys.stdout),  #Muestra los logs en la consola
        logging.FileHandler("/tmp/app.log", encoding="utf-8") #Guarda los logs en un archivo llamado app.log
    ]
)

logger = logging.getLogger("escape_rooms_api")