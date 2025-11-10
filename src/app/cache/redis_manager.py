import redis
import json
import os

class RedisManager:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        try:
            self.client = redis.Redis.from_url(self.redis_url, decode_responses=True)
            # تست اتصال
            self.client.ping()
            print("✅ Connected to Redis")
        except Exception as e:
            print(f"❌ Redis connection failed: {e}")
            self.client = None
    
    def set(self, key: str, value: dict, expire: int = 300) -> bool:
        if not self.client:
            return False
        try:
            serialized_value = json.dumps(value)
            return self.client.setex(key, expire, serialized_value)
        except Exception as e:
            print(f"Redis set error: {e}")
            return False
    
    def get(self, key: str):
        if not self.client:
            return None
        try:
            value = self.client.get(key)
            return json.loads(value) if value else None
        except Exception as e:
            print(f"Redis get error: {e}")
            return None

redis_manager = RedisManager()
