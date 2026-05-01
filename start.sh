#!/bin/bash
# Word Quest — one-command startup script (macOS)
# Usage: ./start.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

cd "$(dirname "$0")"

echo ""
echo -e "${BOLD}🎮  Word Quest: Northern Trails${NC}"
echo "────────────────────────────────"

# ── 1. Docker Desktop ─────────────────────────────────────────────────────────
if ! docker info &>/dev/null 2>&1; then
  echo -e "${YELLOW}🐳  Starting Docker Desktop…${NC}"
  open -a Docker
  printf "    Waiting"
  for i in $(seq 1 30); do
    sleep 2
    if docker info &>/dev/null 2>&1; then
      echo -e " ${GREEN}ready!${NC}"
      break
    fi
    printf "."
    if [ "$i" -eq 30 ]; then
      echo ""
      echo -e "${RED}✗  Docker did not start in time. Please open Docker Desktop manually.${NC}"
      exit 1
    fi
  done
else
  echo -e "${GREEN}🐳  Docker Desktop already running.${NC}"
fi

# ── 2. Docker Compose (Postgres + API) ───────────────────────────────────────
echo -e "${BLUE}🗄   Starting database + API…${NC}"
docker-compose up -d

printf "    Waiting for API"
for i in $(seq 1 40); do
  if curl -s http://localhost:3001/api/health &>/dev/null; then
    echo -e " ${GREEN}ready!${NC}"
    break
  fi
  sleep 2
  printf "."
  if [ "$i" -eq 40 ]; then
    echo ""
    echo -e "${RED}✗  API did not become healthy. Check logs: docker-compose logs api${NC}"
    exit 1
  fi
done

# ── 3. Frontend (Vite) ────────────────────────────────────────────────────────
echo -e "${BLUE}🌐  Starting frontend…${NC}"
npm run dev &
VITE_PID=$!

printf "    Waiting for frontend"
for i in $(seq 1 20); do
  sleep 1
  if curl -s http://localhost:5173 &>/dev/null; then
    echo -e " ${GREEN}ready!${NC}"
    break
  fi
  printf "."
done

# ── 4. Done ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}✅  Word Quest is running!${NC}"
echo ""

# OSC 8 hyperlink — clickable in iTerm2, Warp, VS Code terminal, etc.
printf "    👉  \e]8;;http://localhost:5173\e\\\\http://localhost:5173\e]8;;\e\\\\\n"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the frontend.${NC}"
echo -e "${YELLOW}Docker services keep running in the background.${NC}"
echo -e "${YELLOW}To stop everything: docker-compose down${NC}"
echo ""

# Open browser automatically
open http://localhost:5173

# Keep alive until Ctrl+C
trap 'echo ""; echo -e "${YELLOW}Stopping frontend…${NC}"; kill $VITE_PID 2>/dev/null; echo -e "${YELLOW}Docker is still running. Use: docker-compose down${NC}"; exit 0' INT
wait $VITE_PID
