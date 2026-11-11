
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Account, Payment, LedgerEntry
from app.routes import accounts, payments


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="PayMesh",
    description="Payment processing and reliability simulation platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts.router)
app.include_router(payments.router)


@app.get("/")
def root():
    return {
        "project": "PayMesh",
        "message": "Payment processing engine is running",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
