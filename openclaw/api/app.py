"""FastAPI application factory."""

from __future__ import annotations

from fastapi import FastAPI

from openclaw.config import settings
from openclaw.vps import VPSManager

from .routes import build_router

_manager: VPSManager | None = None


def get_manager() -> VPSManager:
    """Return the application-scoped VPSManager singleton."""
    global _manager
    if _manager is None:
        _manager = VPSManager(storage_path=settings.storage_path)
    return _manager


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="OpenClaw",
        description="AI-powered VPS management platform",
        version="0.1.0",
    )
    app.include_router(build_router(get_manager))
    return app


app = create_app()
