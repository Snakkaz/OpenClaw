"""API route definitions."""

from __future__ import annotations

from typing import Callable, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from openclaw.ai import AIAssistant
from openclaw.vps import VPS, VPSCreate, VPSManager, VPSNotFoundError, VPSUpdate


# ---------------------------------------------------------------------------
# Request / Response schemas specific to API layer
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str
    history: Optional[list[dict]] = None


class ChatResponse(BaseModel):
    reply: str


class SuggestSizeRequest(BaseModel):
    workload: str


class SuggestSizeResponse(BaseModel):
    suggestion: str


class TroubleshootRequest(BaseModel):
    vps_id: str
    problem: str


class TroubleshootResponse(BaseModel):
    advice: str


# ---------------------------------------------------------------------------
# Router factory
# ---------------------------------------------------------------------------

def build_router(get_manager: Callable[[], VPSManager]) -> APIRouter:
    """Return a router wired to *get_manager* for dependency injection."""

    router = APIRouter()
    ai = AIAssistant()

    # ------------------------------------------------------------------
    # VPS endpoints
    # ------------------------------------------------------------------

    @router.get("/vps", response_model=list[VPS], tags=["VPS"])
    def list_vps(
        status: Optional[str] = Query(None, description="Filter by status"),
        region: Optional[str] = Query(None, description="Filter by region"),
        tag: Optional[str] = Query(None, description="Filter by tag"),
    ):
        """List all VPS instances with optional filters."""
        return get_manager().list(status=status, region=region, tag=tag)

    @router.post("/vps", response_model=VPS, status_code=201, tags=["VPS"])
    def create_vps(payload: VPSCreate):
        """Provision a new VPS instance."""
        return get_manager().create(payload)

    @router.get("/vps/{vps_id}", response_model=VPS, tags=["VPS"])
    def get_vps(vps_id: str):
        """Retrieve a VPS by ID."""
        try:
            return get_manager().get(vps_id)
        except VPSNotFoundError:
            raise HTTPException(status_code=404, detail=f"VPS '{vps_id}' not found")

    @router.patch("/vps/{vps_id}", response_model=VPS, tags=["VPS"])
    def update_vps(vps_id: str, patch: VPSUpdate):
        """Partially update a VPS instance."""
        try:
            return get_manager().update(vps_id, patch)
        except VPSNotFoundError:
            raise HTTPException(status_code=404, detail=f"VPS '{vps_id}' not found")

    @router.delete("/vps/{vps_id}", response_model=VPS, tags=["VPS"])
    def delete_vps(vps_id: str):
        """Terminate and remove a VPS instance."""
        try:
            return get_manager().delete(vps_id)
        except VPSNotFoundError:
            raise HTTPException(status_code=404, detail=f"VPS '{vps_id}' not found")

    # ------------------------------------------------------------------
    # AI endpoints
    # ------------------------------------------------------------------

    @router.post("/ai/chat", response_model=ChatResponse, tags=["AI"])
    def ai_chat(req: ChatRequest):
        """Send a message to the OpenClaw AI assistant."""
        try:
            reply = ai.chat(req.message, history=req.history)
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"AI backend error: {exc}") from exc
        return ChatResponse(reply=reply)

    @router.post("/ai/suggest-size", response_model=SuggestSizeResponse, tags=["AI"])
    def ai_suggest_size(req: SuggestSizeRequest):
        """Get an AI-recommended VPS size tier for a described workload."""
        try:
            suggestion = ai.suggest_size(req.workload)
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"AI backend error: {exc}") from exc
        return SuggestSizeResponse(suggestion=suggestion)

    @router.post("/ai/troubleshoot", response_model=TroubleshootResponse, tags=["AI"])
    def ai_troubleshoot(req: TroubleshootRequest):
        """Ask the AI to help diagnose a problem on a specific VPS."""
        try:
            vps = get_manager().get(req.vps_id)
        except VPSNotFoundError:
            raise HTTPException(status_code=404, detail=f"VPS '{req.vps_id}' not found")
        try:
            advice = ai.troubleshoot(vps.model_dump(mode="json"), req.problem)
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"AI backend error: {exc}") from exc
        return TroubleshootResponse(advice=advice)

    # ------------------------------------------------------------------
    # Health check
    # ------------------------------------------------------------------

    @router.get("/health", tags=["System"])
    def health():
        """Return service health status."""
        return {"status": "ok", "service": "openclaw"}

    return router
