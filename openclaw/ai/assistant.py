"""AI assistant that uses an OpenAI-compatible chat completions endpoint."""

from __future__ import annotations

import httpx

from openclaw.config import settings

SYSTEM_PROMPT = """You are OpenClaw AI, an expert assistant for managing Virtual Private Servers (VPS).
You help users with server provisioning, configuration, troubleshooting, security hardening,
performance tuning, and infrastructure best practices.
Always provide concise, actionable advice. When suggesting shell commands, wrap them in
fenced code blocks with the appropriate language tag."""


class AIAssistant:
    """Stateless AI assistant that wraps an OpenAI-compatible chat API."""

    def __init__(
        self,
        api_url: str | None = None,
        api_key: str | None = None,
        model: str | None = None,
    ) -> None:
        self._api_url = (api_url or settings.ai_api_url).rstrip("/")
        self._api_key = api_key or settings.ai_api_key
        self._model = model or settings.ai_model

    def chat(self, user_message: str, history: list[dict] | None = None) -> str:
        """Send *user_message* to the AI and return the assistant reply.

        *history* is a list of ``{"role": "...", "content": "..."}`` dicts
        that allows multi-turn conversations to be supported by callers.
        """
        messages: list[dict] = [{"role": "system", "content": SYSTEM_PROMPT}]
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": user_message})

        headers = {"Content-Type": "application/json"}
        if self._api_key:
            headers["Authorization"] = f"Bearer {self._api_key}"

        payload = {
            "model": self._model,
            "messages": messages,
            "max_tokens": settings.ai_max_tokens,
            "temperature": settings.ai_temperature,
        }

        response = httpx.post(
            f"{self._api_url}/chat/completions",
            headers=headers,
            json=payload,
            timeout=60,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]

    def suggest_size(self, workload_description: str) -> str:
        """Ask the AI to recommend a VPS size tier for a described workload."""
        prompt = (
            f"A user wants to run the following workload on a VPS:\n\n"
            f"{workload_description}\n\n"
            f"Based on the workload, recommend the most appropriate VPS size tier from: "
            f"nano (0.5 GB RAM), micro (1 GB RAM), small (2 GB RAM), "
            f"medium (8 GB RAM), large (16 GB RAM). "
            f"Reply with ONLY the tier name (e.g. 'small') followed by a one-sentence reason."
        )
        return self.chat(prompt)

    def troubleshoot(self, vps_info: dict, problem: str) -> str:
        """Ask the AI to help troubleshoot a problem on a specific VPS."""
        context = (
            f"VPS info: name={vps_info.get('name')}, size={vps_info.get('size')}, "
            f"region={vps_info.get('region')}, image={vps_info.get('image')}, "
            f"status={vps_info.get('status')}."
        )
        prompt = f"{context}\n\nProblem reported: {problem}\n\nHow should I fix this?"
        return self.chat(prompt)
