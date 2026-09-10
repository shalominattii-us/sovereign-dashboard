# sovereign-dashboard

Operator console for the Sovereign stack. Single pane of glass over the
AE Hub swarm, Governor service, LLM Armada, and treasury layer.

## Surfaces

| Surface | Repo / Path | Status |
|---------|-------------|--------|
| React operator console | `sovereign-dashboard-react` | scaffolded |
| VR/spatial backend | `aegentis-vr-backend` | WebSocket server |
| Mission control | `AEGENTIX-MISSION-CONTROL` | consolidated |

## Layout

- `web/` — dashboard frontend
- `api/` — status and control endpoints
- `docs/` — design notes

## Data sources

- Governor heartbeat (`C:\Sovereign\Governor\governor.ps1` on the primary node)
- AE Hub 8-node swarm status (see `sovereign-recon` for the node table)
- LLM Armada services: Ollama :11434, OpenWebUI :3000, SearXNG :8080, n8n :5678, code-server :8443
