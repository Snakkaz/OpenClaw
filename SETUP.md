# OpenClaw Setup — Petersen Digital Consulting

Denne filen dokumenterer hvordan OpenClaw-agentene er satt opp på VPS-en.
Bruk den til å gjenopprette oppsettet hvis noe skjer.

---

## Server

| | |
|---|---|
| **Host** | srv1413711.hstgr.cloud (187.124.2.222) |
| **OS** | Ubuntu 25.10 |
| **Plan** | KVM2 — 2 vCPU, 8GB RAM, 100GB disk |
| **Swap** | 4GB |

## Installasjon

```bash
# Installer OpenClaw
npm install -g openclaw

# Start gateway som systemd-tjeneste
openclaw gateway start

# Koble til GitHub Copilot
openclaw auth login --provider github-copilot
```

## Agenter

| ID | Navn | Modell | Workspace | Rolle |
|---|---|---|---|---|
| main | OpenClaw 🦞 | claude-sonnet-4.6 | /root/.openclaw/workspace | Hoved-agent, WhatsApp |
| dev | DevClaw 🛠️ | claude-sonnet-4.6 | /root/.openclaw/workspace-dev | Koding, nettsider |
| marketing | MarketClaw 📈 | gpt-4o (default) | /root/.openclaw/workspace-marketing | SEO, annonser |
| research | ResearchClaw 🔬 | gpt-4o (default) | /root/.openclaw/workspace-research | Rapporter, analyse |
| local-ollama | OllamaClaw 🖥️ | gpt-4o (default) | /root/.openclaw/workspace-local-ollama | Lokale/raske oppgaver |

## Modeller (GitHub Copilot)

```
Primary:   github-copilot/gpt-4o
Fallback1: github-copilot/claude-haiku-4.5
Fallback2: github-copilot/gpt-4.1

Main/Dev agent: github-copilot/claude-sonnet-4.6
```

## Kanaler

- **WhatsApp**: +4740393847 (koblet via Baileys QR-pairing)
- **Telegram**: @SnakkaZ_bot (token i openclaw.json)
- **WebChat**: https://srv1413711.hstgr.cloud (via nginx HTTPS)

## Workspace-struktur

Hvert workspace inneholder:
```
SOUL.md       — agentens personlighet og rolle
USER.md       — info om Stian / Petersen Digital
AGENTS.md     — operasjonelle instruksjoner
TOOLS.md      — server-info, API-nøkler, lenker
MEMORY.md     — langtidshukommelse (kun main-agent)
memory/       — daglige logger (YYYY-MM-DD.md)
```

## Gjenopprette fra scratch

```bash
# 1. Installer Node + OpenClaw
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g openclaw

# 2. Klon dette repoet
git clone git@github.com:Snakkaz/OpenClaw.git
# Kopier workspace-filer til /root/.openclaw/workspace/

# 3. Konfigurer openclaw.json
# Se config/openclaw.json i dette repoet

# 4. Koble GitHub Copilot
openclaw auth login --provider github-copilot

# 5. Start gateway
openclaw gateway start --daemon
```

## Prosjekter

| Prosjekt | Repo | Live | Stack |
|---|---|---|---|
| PetersenDC.no | github.com/Snakkaz/PetersenDC | https://petersendc.no | PHP/HTML/JS/MySQL |

## Viktige filer på VPS

```
/root/.openclaw/openclaw.json          — hoved-konfig
/root/.openclaw/workspace/             — main agent workspace
/root/.openclaw/workspace-dev/         — DevClaw workspace
/root/.openclaw/workspace-marketing/   — MarketClaw workspace
/root/.openclaw/workspace-research/    — ResearchClaw workspace
/root/.openclaw/credentials/           — tokens (ikke commit!)
/var/www/petersendc/                   — PetersenDC.no nettside
```

---

*Sist oppdatert: 2026-02-27*
