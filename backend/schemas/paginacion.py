from pydantic import BaseModel


class Paginacion(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int
