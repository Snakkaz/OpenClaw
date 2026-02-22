"""VPS manager – in-memory store with optional JSON file persistence."""

from __future__ import annotations

import json
import pathlib
from datetime import datetime, timezone
from typing import Optional

from .models import VPS, VPSCreate, VPSUpdate


class VPSNotFoundError(Exception):
    """Raised when a VPS with the given ID does not exist."""


class VPSManager:
    """Manages the lifecycle of VPS instances.

    Uses a plain in-memory dict for storage.  When *storage_path* is set the
    store is persisted to / loaded from a JSON file so that data survives
    process restarts.
    """

    def __init__(self, storage_path: str = "") -> None:
        self._storage_path: Optional[pathlib.Path] = (
            pathlib.Path(storage_path) if storage_path else None
        )
        self._store: dict[str, VPS] = {}
        if self._storage_path and self._storage_path.exists():
            self._load()

    # ------------------------------------------------------------------
    # Public CRUD
    # ------------------------------------------------------------------

    def create(self, payload: VPSCreate) -> VPS:
        """Provision a new VPS instance and return it."""
        vps = VPS.from_create(payload)
        # Simulate a quick transition to RUNNING with an assigned IP.
        vps.status = _simulate_status_after_provision()
        vps.ip_address = _generate_ip(vps.id)
        self._store[vps.id] = vps
        self._save()
        return vps

    def list(
        self,
        *,
        status: Optional[str] = None,
        region: Optional[str] = None,
        tag: Optional[str] = None,
    ) -> list[VPS]:
        """Return all VPS instances, with optional filters."""
        results = list(self._store.values())
        if status:
            results = [v for v in results if v.status.value == status]
        if region:
            results = [v for v in results if v.region == region]
        if tag:
            results = [v for v in results if tag in v.tags]
        return results

    def get(self, vps_id: str) -> VPS:
        """Return a VPS by ID or raise *VPSNotFoundError*."""
        try:
            return self._store[vps_id]
        except KeyError:
            raise VPSNotFoundError(vps_id)

    def update(self, vps_id: str, patch: VPSUpdate) -> VPS:
        """Apply a partial update and return the updated VPS."""
        vps = self.get(vps_id)
        data = vps.model_dump()
        for field, value in patch.model_dump(exclude_none=True).items():
            data[field] = value
        data["updated_at"] = datetime.now(timezone.utc)
        updated = VPS(**data)
        self._store[vps_id] = updated
        self._save()
        return updated

    def delete(self, vps_id: str) -> VPS:
        """Terminate and remove a VPS, returning its final state."""
        vps = self.get(vps_id)
        data = vps.model_dump()
        data["status"] = "terminated"
        data["updated_at"] = datetime.now(timezone.utc)
        terminated = VPS(**data)
        del self._store[vps_id]
        self._save()
        return terminated

    # ------------------------------------------------------------------
    # Persistence helpers
    # ------------------------------------------------------------------

    def _save(self) -> None:
        if self._storage_path is None:
            return
        self._storage_path.parent.mkdir(parents=True, exist_ok=True)
        payload = {vid: v.model_dump(mode="json") for vid, v in self._store.items()}
        self._storage_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    def _load(self) -> None:
        assert self._storage_path is not None
        raw = json.loads(self._storage_path.read_text(encoding="utf-8"))
        self._store = {vid: VPS(**data) for vid, data in raw.items()}


# ------------------------------------------------------------------
# Internal helpers
# ------------------------------------------------------------------

def _simulate_status_after_provision():
    """Return RUNNING to simulate a successful provisioning."""
    from .models import VPSStatus
    return VPSStatus.RUNNING


def _generate_ip(vps_id: str) -> str:
    """Deterministically derive a fake IP from the VPS UUID for demo purposes."""
    # Use the last 8 hex chars of the UUID to build a 10.x.x.x address.
    suffix = int(vps_id.replace("-", "")[-8:], 16)
    a = (suffix >> 16) & 0xFF
    b = (suffix >> 8) & 0xFF
    c = suffix & 0xFF
    return f"10.{a}.{b}.{c}"
