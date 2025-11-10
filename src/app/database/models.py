from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.sql import func
from .database import Base

class Coin(Base):
    __tablename__ = "coins"
    
    id = Column(Integer, primary_key=True, index=True)
    coin_id = Column(String, unique=True, index=True)
    name = Column(String)
    symbol = Column(String)
    price = Column(Float)
    market_cap = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    source = Column(String)
    published_at = Column(DateTime(timezone=True))
    sentiment = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now()
