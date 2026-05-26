from fastapi import FastAPI

app = FastAPI(
    title="Escape Rooms API",
    description="API REST para la gestion de un negocio de escape rooms",
    version="1.0.0",
)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}