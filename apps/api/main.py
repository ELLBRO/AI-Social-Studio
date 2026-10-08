import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from apps.api.core.config import settings
from apps.api.core.database import Base, engine, SessionLocal
from apps.api.core.exceptions import AppException
from apps.api.core.logging import logger
from apps.api.domains.billing.service import BillingService

# Routers
from apps.api.routers.auth import router as auth_router
from apps.api.routers.organizations import router as org_router
from apps.api.routers.content import router as content_router
from apps.api.routers.media import router as media_router
from apps.api.routers.video import router as video_router
from apps.api.routers.social import router as social_router
from apps.api.routers.publishing import router as publishing_router
from apps.api.routers.calendar import router as calendar_router
from apps.api.routers.analytics import router as analytics_router
from apps.api.routers.optimization import router as optimization_router
from apps.api.routers.billing import router as billing_router
from apps.api.routers.credits import router as credits_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing AI Social Studio API database schemas...")
    Base.metadata.create_all(bind=engine)
    # Seed default plans if needed
    with SessionLocal() as db:
        BillingService.seed_plans_if_empty(db)
    logger.info("Database schemas ready. Server operational.")
    yield
    logger.info("Shutting down AI Social Studio API...")


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="AI Social Media Growth Platform Production Backend API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request ID and Latency Middleware
@app.middleware("http")
async def add_process_time_and_request_id(request: Request, call_next):
    req_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = req_id
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Request-ID"] = req_id
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response


# Centralized Exception Handler
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "code": exc.code,
            "message": exc.detail,
            "request_id": getattr(request.state, "request_id", None),
            "extra": exc.extra,
        },
    )


# Health Check
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "env": settings.APP_ENV,
        "version": "1.0.0",
    }


@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": "/docs",
        "version": "1.0.0",
    }


# Include v1 Domain Routers
API_V1_PREFIX = "/api/v1"
app.include_router(auth_router, prefix=API_V1_PREFIX)
app.include_router(org_router, prefix=API_V1_PREFIX)
app.include_router(content_router, prefix=API_V1_PREFIX)
app.include_router(media_router, prefix=API_V1_PREFIX)
app.include_router(video_router, prefix=API_V1_PREFIX)
app.include_router(social_router, prefix=API_V1_PREFIX)
app.include_router(publishing_router, prefix=API_V1_PREFIX)
app.include_router(calendar_router, prefix=API_V1_PREFIX)
app.include_router(analytics_router, prefix=API_V1_PREFIX)
app.include_router(optimization_router, prefix=API_V1_PREFIX)
app.include_router(billing_router, prefix=API_V1_PREFIX)
app.include_router(credits_router, prefix=API_V1_PREFIX)
