"""Tests for VPS models and manager."""

from __future__ import annotations

import pytest

from openclaw.vps import VPS, VPSCreate, VPSManager, VPSNotFoundError, VPSSize, VPSStatus


# ---------------------------------------------------------------------------
# Model tests
# ---------------------------------------------------------------------------

def test_vps_from_create_applies_size_specs():
    payload = VPSCreate(name="test-server", size=VPSSize.SMALL)
    vps = VPS.from_create(payload)
    assert vps.name == "test-server"
    assert vps.size == VPSSize.SMALL
    assert vps.vcpus == 2
    assert vps.ram_gb == 2
    assert vps.disk_gb == 40


def test_vps_defaults():
    payload = VPSCreate(name="nano-box", size=VPSSize.NANO)
    vps = VPS.from_create(payload)
    assert vps.vcpus == 1
    assert vps.ram_gb == 0.5
    assert vps.disk_gb == 10
    assert vps.status == VPSStatus.PENDING


def test_vps_large_tier():
    payload = VPSCreate(name="big-box", size=VPSSize.LARGE)
    vps = VPS.from_create(payload)
    assert vps.vcpus == 8
    assert vps.ram_gb == 16
    assert vps.disk_gb == 160


def test_vps_create_with_tags():
    payload = VPSCreate(name="tagged", size=VPSSize.MICRO, tags=["web", "prod"])
    vps = VPS.from_create(payload)
    assert "web" in vps.tags
    assert "prod" in vps.tags


# ---------------------------------------------------------------------------
# Manager tests
# ---------------------------------------------------------------------------

@pytest.fixture
def manager():
    return VPSManager()


def test_create_returns_running_vps(manager):
    payload = VPSCreate(name="my-server", size=VPSSize.SMALL)
    vps = manager.create(payload)
    assert vps.id
    assert vps.status == VPSStatus.RUNNING
    assert vps.ip_address is not None


def test_list_empty(manager):
    assert manager.list() == []


def test_list_after_create(manager):
    manager.create(VPSCreate(name="s1", size=VPSSize.NANO))
    manager.create(VPSCreate(name="s2", size=VPSSize.MICRO))
    assert len(manager.list()) == 2


def test_list_filter_by_status(manager):
    manager.create(VPSCreate(name="s1"))
    vps2 = manager.create(VPSCreate(name="s2"))
    # Manually stop vps2
    from openclaw.vps.models import VPSUpdate
    manager.update(vps2.id, VPSUpdate(status=VPSStatus.STOPPED))
    running = manager.list(status="running")
    assert len(running) == 1
    assert running[0].name == "s1"


def test_list_filter_by_region(manager):
    manager.create(VPSCreate(name="eu", region="eu-west-1"))
    manager.create(VPSCreate(name="us", region="us-east-1"))
    result = manager.list(region="eu-west-1")
    assert len(result) == 1
    assert result[0].name == "eu"


def test_list_filter_by_tag(manager):
    manager.create(VPSCreate(name="web", tags=["web"]))
    manager.create(VPSCreate(name="db", tags=["db"]))
    result = manager.list(tag="web")
    assert len(result) == 1
    assert result[0].name == "web"


def test_get_existing(manager):
    created = manager.create(VPSCreate(name="get-me"))
    fetched = manager.get(created.id)
    assert fetched.id == created.id


def test_get_missing(manager):
    with pytest.raises(VPSNotFoundError):
        manager.get("nonexistent-id")


def test_update_name(manager):
    vps = manager.create(VPSCreate(name="old-name"))
    from openclaw.vps.models import VPSUpdate
    updated = manager.update(vps.id, VPSUpdate(name="new-name"))
    assert updated.name == "new-name"
    assert updated.id == vps.id


def test_update_tags(manager):
    vps = manager.create(VPSCreate(name="tag-me"))
    from openclaw.vps.models import VPSUpdate
    updated = manager.update(vps.id, VPSUpdate(tags=["alpha", "beta"]))
    assert updated.tags == ["alpha", "beta"]


def test_update_missing(manager):
    from openclaw.vps.models import VPSUpdate
    with pytest.raises(VPSNotFoundError):
        manager.update("no-such-id", VPSUpdate(name="x"))


def test_delete_removes_vps(manager):
    vps = manager.create(VPSCreate(name="delete-me"))
    terminated = manager.delete(vps.id)
    assert terminated.status == VPSStatus.TERMINATED
    assert len(manager.list()) == 0


def test_delete_missing(manager):
    with pytest.raises(VPSNotFoundError):
        manager.delete("no-such-id")


def test_persistence(tmp_path):
    storage = str(tmp_path / "vps.json")
    m1 = VPSManager(storage_path=storage)
    vps = m1.create(VPSCreate(name="persistent"))

    # Load from the same file in a new manager
    m2 = VPSManager(storage_path=storage)
    loaded = m2.get(vps.id)
    assert loaded.name == "persistent"
    assert loaded.status == VPSStatus.RUNNING
