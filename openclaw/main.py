"""OpenClaw CLI entry point."""

from __future__ import annotations

import typer
import uvicorn
from rich.console import Console
from rich.table import Table

from openclaw.config import settings
from openclaw.vps import VPSCreate, VPSManager, VPSSize

app = typer.Typer(
    name="openclaw",
    help="OpenClaw – AI-powered VPS management platform",
    no_args_is_help=True,
)

console = Console()
_manager: VPSManager | None = None


def _get_manager() -> VPSManager:
    global _manager
    if _manager is None:
        _manager = VPSManager(storage_path=settings.storage_path)
    return _manager


# ---------------------------------------------------------------------------
# Server sub-commands
# ---------------------------------------------------------------------------

server_app = typer.Typer(help="Manage the OpenClaw API server")
app.add_typer(server_app, name="server")


@server_app.command("start")
def server_start(
    host: str = typer.Option(settings.api_host, help="Bind host"),
    port: int = typer.Option(settings.api_port, help="Bind port"),
    reload: bool = typer.Option(False, help="Enable auto-reload (development)"),
):
    """Start the OpenClaw API server."""
    console.print(f"[bold green]Starting OpenClaw API server on {host}:{port}[/bold green]")
    uvicorn.run("openclaw.api.app:app", host=host, port=port, reload=reload)


# ---------------------------------------------------------------------------
# VPS sub-commands
# ---------------------------------------------------------------------------

vps_app = typer.Typer(help="Manage VPS instances")
app.add_typer(vps_app, name="vps")


@vps_app.command("list")
def vps_list(
    status: str = typer.Option("", help="Filter by status"),
    region: str = typer.Option("", help="Filter by region"),
    tag: str = typer.Option("", help="Filter by tag"),
):
    """List all VPS instances."""
    manager = _get_manager()
    instances = manager.list(
        status=status or None,
        region=region or None,
        tag=tag or None,
    )
    if not instances:
        console.print("[yellow]No VPS instances found.[/yellow]")
        return

    table = Table(title="VPS Instances")
    for col in ("ID", "Name", "Size", "Region", "Status", "IP Address", "Created"):
        table.add_column(col)

    for v in instances:
        table.add_row(
            v.id[:8] + "…",
            v.name,
            v.size.value,
            v.region,
            v.status.value,
            v.ip_address or "—",
            v.created_at.strftime("%Y-%m-%d %H:%M"),
        )
    console.print(table)


@vps_app.command("create")
def vps_create(
    name: str = typer.Argument(..., help="VPS name"),
    size: VPSSize = typer.Option(VPSSize.SMALL, help="Resource tier"),
    region: str = typer.Option("us-east-1", help="Region"),
    image: str = typer.Option("ubuntu-22.04", help="OS image"),
):
    """Provision a new VPS instance."""
    payload = VPSCreate(name=name, size=size, region=region, image=image)
    vps = _get_manager().create(payload)
    console.print(f"[bold green]✓ VPS created:[/bold green] {vps.id}")
    console.print(f"  Name:   {vps.name}")
    console.print(f"  Size:   {vps.size.value}  ({vps.vcpus} vCPU, {vps.ram_gb} GB RAM, {vps.disk_gb} GB disk)")
    console.print(f"  Region: {vps.region}")
    console.print(f"  Status: {vps.status.value}")
    console.print(f"  IP:     {vps.ip_address}")


@vps_app.command("get")
def vps_get(vps_id: str = typer.Argument(..., help="VPS ID")):
    """Show details for a specific VPS."""
    from openclaw.vps import VPSNotFoundError
    try:
        vps = _get_manager().get(vps_id)
    except VPSNotFoundError:
        console.print(f"[red]VPS '{vps_id}' not found.[/red]")
        raise typer.Exit(1)

    console.print(f"[bold]VPS {vps.id}[/bold]")
    for label, value in [
        ("Name", vps.name),
        ("Size", vps.size.value),
        ("vCPUs", str(vps.vcpus)),
        ("RAM", f"{vps.ram_gb} GB"),
        ("Disk", f"{vps.disk_gb} GB"),
        ("Region", vps.region),
        ("Image", vps.image),
        ("Status", vps.status.value),
        ("IP", vps.ip_address or "—"),
        ("Tags", ", ".join(vps.tags) or "—"),
        ("Created", vps.created_at.isoformat()),
        ("Updated", vps.updated_at.isoformat()),
    ]:
        console.print(f"  {label:10s}: {value}")


@vps_app.command("delete")
def vps_delete(
    vps_id: str = typer.Argument(..., help="VPS ID to terminate"),
    yes: bool = typer.Option(False, "--yes", "-y", help="Skip confirmation"),
):
    """Terminate a VPS instance."""
    from openclaw.vps import VPSNotFoundError
    if not yes:
        confirmed = typer.confirm(f"Terminate VPS '{vps_id}'?")
        if not confirmed:
            console.print("Aborted.")
            return
    try:
        vps = _get_manager().delete(vps_id)
    except VPSNotFoundError:
        console.print(f"[red]VPS '{vps_id}' not found.[/red]")
        raise typer.Exit(1)
    console.print(f"[bold red]✓ VPS '{vps.name}' ({vps_id}) terminated.[/bold red]")


# ---------------------------------------------------------------------------
# AI sub-commands
# ---------------------------------------------------------------------------

ai_app = typer.Typer(help="OpenClaw AI assistant")
app.add_typer(ai_app, name="ai")


@ai_app.command("chat")
def ai_chat(message: str = typer.Argument(..., help="Message to send to the AI")):
    """Chat with the OpenClaw AI assistant."""
    from openclaw.ai import AIAssistant
    assistant = AIAssistant()
    console.print("[bold blue]Asking AI…[/bold blue]")
    try:
        reply = assistant.chat(message)
    except Exception as exc:
        console.print(f"[red]AI error: {exc}[/red]")
        raise typer.Exit(1)
    console.print(f"\n[bold]AI:[/bold] {reply}")


@ai_app.command("suggest-size")
def ai_suggest_size(workload: str = typer.Argument(..., help="Workload description")):
    """Get an AI-recommended VPS size tier."""
    from openclaw.ai import AIAssistant
    assistant = AIAssistant()
    console.print("[bold blue]Asking AI for size recommendation…[/bold blue]")
    try:
        suggestion = assistant.suggest_size(workload)
    except Exception as exc:
        console.print(f"[red]AI error: {exc}[/red]")
        raise typer.Exit(1)
    console.print(f"\n[bold]Recommendation:[/bold] {suggestion}")
