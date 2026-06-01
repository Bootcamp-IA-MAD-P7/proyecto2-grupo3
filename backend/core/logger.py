import logging
import os
import sys

# =====================================================================
# CONFIGURACIÓN DE LOGGING
# =====================================================================
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "app.log")

logging.basicConfig(
    level=logging.INFO,  # Captura INFO, WARNING, ERROR y CRITICAL
    format=LOG_FORMAT,
    handlers=[
        logging.StreamHandler(sys.stdout),  #Muestra los logs en la consola
        logging.FileHandler(log_file, encoding="utf-8") #Guarda los logs en un archivo llamado app.log
    ]
)

logger = logging.getLogger("escape_rooms_api")