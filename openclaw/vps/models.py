"""VPS data models."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class VPSStatus(str, Enum):
    """Lifecycle status of a VPS instance."""

    PENDING = "pending"
    RUNNING = "running"
    STOPPED = "stopped"
    REBOOTING = "rebooting"
    TERMINATED = "terminated"


class VPSSize(str, Enum):
    """Pre-defined resource tiers."""

    NANO = "nano"      # 1 vCPU, 512 MB RAM
    MICRO = "micro"    # 1 vCPU, 1 GB RAM
    SMALL = "small"    # 2 vCPU, 2 GB RAM
    MEDIUM = "medium"  # 4 vCPU, 8 GB RAM
    LARGE = "large"    # 8 vCPU, 16 GB RAM


_SIZE_SPECS: dict[VPSSize, dict[str, int | float]] = {
    VPSSize.NANO:   {"vcpus": 1, "ram_gb": 0.5,  "disk_gb": 10},
    VPSSize.MICRO:  {"vcpus": 1, "ram_gb": 1,    "disk_gb": 20},
    VPSSize.SMALL:  {"vcpus": 2, "ram_gb": 2,    "disk_gb": 40},
    VPSSize.MEDIUM: {"vcpus": 4, "ram_gb": 8,    "disk_gb": 80},
    VPSSize.LARGE:  {"vcpus": 8, "ram_gb": 16,   "disk_gb": 160},
}


class VPSCreate(BaseModel):
    """Payload for creating a new VPS instance."""

    name: str = Field(..., min_length=1, max_length=64, description="Human-readable name")
    size: VPSSize = Field(VPSSize.SMALL, description="Resource tier")
    region: str = Field("us-east-1", description="Deployment region")
    image: str = Field("ubuntu-22.04", description="OS image identifier")
    tags: list[str] = Field(default_factory=list, description="Arbitrary labels")


class VPS(BaseModel):
    """A VPS instance."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    size: VPSSize
    region: str
    image: str
    tags: list[str] = Field(default_factory=list)
    status: VPSStatus = VPSStatus.PENDING
    ip_address: Optional[str] = None
    vcpus: int = 1
    ram_gb: float = 1.0
    disk_gb: int = 20
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @classmethod
    def from_create(cls, payload: VPSCreate) -> "VPS":
        """Construct a VPS from a creation payload, applying size defaults."""
        specs = _SIZE_SPECS[payload.size]
        return cls(
            name=payload.name,
            size=payload.size,
            region=payload.region,
            image=payload.image,
            tags=payload.tags,
            vcpus=specs["vcpus"],
            ram_gb=specs["ram_gb"],
            disk_gb=specs["disk_gb"],
        )


class VPSUpdate(BaseModel):
    """Fields that can be updated after creation."""

    name: Optional[str] = Field(None, min_length=1, max_length=64)
    tags: Optional[list[str]] = None
    status: Optional[VPSStatus] = None
