"""Tests for the REST API layer."""

from __future__ import annotations

import importlib

import pytest
from fastapi.testclient import TestClient

from openclaw.vps import VPSManager
from openclaw.api.app import create_app


@pytest.fixture
def client():
    """Create a test client backed by a fresh in-memory VPS manager."""
    api_module = importlib.import_module("openclaw.api.app")
    manager = VPSManager()

    original = api_module._manager
    api_module._manager = manager
    try:
        with TestClient(api_module.app) as c:
            yield c
    finally:
        api_module._manager = original


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


# ---------------------------------------------------------------------------
# VPS CRUD
# ---------------------------------------------------------------------------

def test_create_vps(client):
    resp = client.post("/vps", json={"name": "api-server", "size": "small"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "api-server"
    assert data["size"] == "small"
    assert data["status"] == "running"
    assert data["ip_address"] is not None


def test_list_vps_empty(client):
    resp = client.get("/vps")
    assert resp.status_code == 200
    assert resp.json() == []


def test_list_vps_after_create(client):
    client.post("/vps", json={"name": "s1"})
    client.post("/vps", json={"name": "s2"})
    resp = client.get("/vps")
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_get_vps(client):
    created = client.post("/vps", json={"name": "get-me"}).json()
    resp = client.get(f"/vps/{created['id']}")
    assert resp.status_code == 200
    assert resp.json()["id"] == created["id"]


def test_get_vps_not_found(client):
    resp = client.get("/vps/nonexistent")
    assert resp.status_code == 404


def test_update_vps(client):
    created = client.post("/vps", json={"name": "to-update"}).json()
    resp = client.patch(f"/vps/{created['id']}", json={"name": "updated-name"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "updated-name"


def test_update_vps_not_found(client):
    resp = client.patch("/vps/nonexistent", json={"name": "x"})
    assert resp.status_code == 404


def test_delete_vps(client):
    created = client.post("/vps", json={"name": "to-delete"}).json()
    resp = client.delete(f"/vps/{created['id']}")
    assert resp.status_code == 200
    assert resp.json()["status"] == "terminated"
    # Should now be gone
    assert client.get(f"/vps/{created['id']}").status_code == 404


def test_delete_vps_not_found(client):
    resp = client.delete("/vps/nonexistent")
    assert resp.status_code == 404


def test_list_vps_filter_by_status(client):
    client.post("/vps", json={"name": "running-server"})
    stopped = client.post("/vps", json={"name": "stopped-server"}).json()
    client.patch(f"/vps/{stopped['id']}", json={"status": "stopped"})

    resp = client.get("/vps?status=running")
    names = [v["name"] for v in resp.json()]
    assert "running-server" in names
    assert "stopped-server" not in names


def test_list_vps_filter_by_region(client):
    client.post("/vps", json={"name": "eu-server", "region": "eu-west-1"})
    client.post("/vps", json={"name": "us-server", "region": "us-east-1"})
    resp = client.get("/vps?region=eu-west-1")
    assert len(resp.json()) == 1
    assert resp.json()[0]["name"] == "eu-server"
