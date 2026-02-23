"""Portfolio content management routes for OpenClaw.

Allows the AI agent to update Petersen Digital portfolio content
via natural language commands from WhatsApp/Telegram.
"""

from __future__ import annotations

import json
import os

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from openclaw.ai import AIAssistant

PORTFOLIO_CMS_URL = os.getenv("PORTFOLIO_CMS_URL", "http://localhost:3000/api/cms")
PORTFOLIO_CMS_KEY = os.getenv("PORTFOLIO_CMS_SECRET_KEY", "")

PORTFOLIO_PARSER_PROMPT = """You are a portfolio content manager for Petersen Digital.
The user will send a natural language command (possibly in Norwegian) to manage
portfolio projects. Parse the intent and return ONLY valid JSON matching this schema:

{
  "action": "add_project" | "update_project" | "delete_project",
  "data": {
    "slug": "url-friendly-slug",
    "title": "Project Title",
    "description": "Short description (1-2 sentences)",
    "tech": ["Laravel", "Node.js"],
    "url": "https://example.com or empty string",
    "github": "https://github.com/... or empty string",
    "featured": false,
    "status": "published",
    "body": "Longer markdown description or empty string"
  }
}

For delete_project, only include "slug" in data.
Return ONLY valid JSON — no prose, no markdown fences."""


class PortfolioUpdateRequest(BaseModel):
    message: str


class PortfolioUpdateResponse(BaseModel):
    ok: bool
    message: str
    slug: str | None = None


portfolio_router = APIRouter(tags=["Portfolio"])


@portfolio_router.post("/portfolio/update", response_model=PortfolioUpdateResponse)
def portfolio_update(req: PortfolioUpdateRequest):
    """Parse a natural language command and update portfolio content."""
    ai = AIAssistant()

    # Step 1: Use AI to parse natural language into structured JSON
    try:
        raw_json = ai.chat(
            req.message,
            history=[{"role": "system", "content": PORTFOLIO_PARSER_PROMPT}],
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI parse error: {exc}") from exc

    # Step 2: Parse the AI response as JSON
    try:
        parsed = json.loads(raw_json.strip())
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=422,
            detail=f"AI returned invalid JSON: {raw_json[:200]}",
        )

    # Step 3: Forward structured payload to the portfolio CMS endpoint
    if not PORTFOLIO_CMS_KEY:
        raise HTTPException(
            status_code=500,
            detail="PORTFOLIO_CMS_SECRET_KEY is not configured",
        )

    try:
        resp = httpx.post(
            PORTFOLIO_CMS_URL,
            json=parsed,
            headers={"Authorization": f"Bearer {PORTFOLIO_CMS_KEY}"},
            timeout=15,
        )
        resp.raise_for_status()
        result = resp.json()
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502, detail=f"Portfolio CMS error: {exc}"
        ) from exc

    return PortfolioUpdateResponse(
        ok=result.get("ok", False),
        message=result.get("message", "Done"),
        slug=result.get("slug"),
    )


@portfolio_router.get("/portfolio/health", tags=["Portfolio"])
def portfolio_health():
    """Check connectivity to the portfolio CMS."""
    try:
        resp = httpx.get(
            PORTFOLIO_CMS_URL.replace("/api/cms", "/api/health"),
            timeout=5,
        )
        return {"ok": resp.status_code == 200, "cms_url": PORTFOLIO_CMS_URL}
    except httpx.HTTPError as exc:
        return {"ok": False, "error": str(exc), "cms_url": PORTFOLIO_CMS_URL}
