---
title: "Petersen Digital Portfolio Site"
slug: "petersen-digital-portfolio"
date: "2026-02-23"
featured: true
status: "published"
description: "AI-drevet portfolio med Next.js, markdown CMS og WhatsApp-integrasjon via OpenClaw."
tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "OpenClaw"]
url: "https://srv1413711.hstgr.cloud"
github: ""
image: ""
---

## Prosjekt

Portefoliosiden du ser på nå! Bygget med Next.js 14 og Tailwind CSS, med et AI-drevet CMS
som lar meg oppdatere innholdet direkte via WhatsApp eller Telegram.

## Teknologi

- **Next.js 14** med App Router og TypeScript
- **Tailwind CSS** for styling
- **Markdown + YAML** frontmatter som CMS
- **OpenClaw** for AI-agentintegrasjon
- **PM2 + Nginx** for produksjonsdrift på VPS

## Funksjonalitet

Siden oppdateres automatisk når jeg sender en WhatsApp-melding til OpenClaw-agenten min.
Agenten parser meldingen med Claude Sonnet 4.6 og skriver til markdown-filene via et
sikret API-endepunkt.
