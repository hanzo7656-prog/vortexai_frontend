from fastapi import FastAPI
from .cache.redis_manager import redis_manager

app = FastAPI(title="VortexAI Cache Service")

@app.post("/cache/{key}")
async def set_cache(key: str, data: dict, expire: int = 300):
    """ذخیره داده در کش"""
    success = redis_manager.set(key, data, expire)
    return {"status": "success" if success else "error"}

@app.get("/cache/{key}")
async def get_cache(key: str):
    """خواندن داده از کش"""
    data = redis_manager.get(key)
    if data:
        return data
    return {"error": "Not found"}, 404

@app.get("/")
async def root():
    return {
        "message": "VortexAI Cache Service",
        "endpoints": {
            "set_cache": "POST /cache/{key}",
            "get_cache": "GET /cache/{key}"
        }
    }
