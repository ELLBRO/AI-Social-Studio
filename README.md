# AI Social Studio 🚀

AI Social Studio is a commercial-grade, multi-tenant AI Social Media Growth Platform engineered for creators, founders, and growth agencies in the US market. The platform provides an end-to-end publishing pipeline: AI content strategy, viral hook generation, video scripting with visual/audio cues, asynchronous video generation, multi-platform captions, tiered hashtag indexing, calendar scheduling, official API publishing, and closed-loop algorithmic performance auditing.

---

## 🏛️ Architecture Overview

The system is architected as a modular monorepo cleanly separating the client presentation layer from domain services and background workers:

```
AI-SOCIAL-STUDIO/
├── apps/
│   ├── api/                   # FastAPI modular backend (v1 endpoints, SQLAlchemy models, Alembic)
│   │   ├── alembic/           # Database migration versions
│   │   ├── core/              # Security (bcrypt, JWT), database engine, config, centralized errors
│   │   ├── domains/           # Domain services & provider abstractions (AI, video, social, billing, credits)
│   │   ├── models/            # Normalized SQLAlchemy models (30+ entities)
│   │   ├── routers/           # 12 modular APIRouters under /api/v1
│   │   └── schemas/           # Pydantic v2 validation models
│   ├── web/                   # Next.js (App Router, React 19, TypeScript, Tailwind CSS)
│   │   ├── app/               # 29 production routes (public marketing & authenticated SaaS studio)
│   │   ├── components/        # Layout, Sidebar, Header, Toaster, Badges
│   │   ├── context/           # AuthContext (sessions, multi-tenant org selector, live credit updates)
│   │   └── lib/               # Typed apiFetch client with token/tenant propagation
│   └── worker/                # Background Worker (async publishing execution & jobs queue)
├── infrastructure/
│   └── docker/                # Multi-stage production Dockerfiles (api, worker, web)
├── packages/                  # Shared configuration & domain type contracts
├── scripts/                   # Database seeders (seed.py with pre-populated demo studio)
├── tests/                     # Automated pytest test suites covering all API domains
├── docker-compose.yml         # Local & staging container orchestration (Postgres, Redis, API, Worker, Web)
├── alembic.ini                # Alembic database migration config
└── .env.example               # Environment variables template with safe placeholders
```

---

## ✨ Key Capabilities

1. **Provider-Independent AI Architecture**:
   - Pluggable AI engine supporting OpenAI, Anthropic Claude, Google Gemini, and offline fallback mock providers without altering business logic.
   - Task-level domain services for Strategy, Ideas, Hooks, Scripts, Captions, Hashtags, and Performance Auditing.

2. **Asynchronous Video Generation Pipeline**:
   - Provider-independent video generation abstraction (Runway Gen-3, Studio Diffusion).
   - Non-blocking job queues with progress tracking, aspect ratio control (9:16 vertical TikTok/Reels, 16:9 YouTube), and storage asset attachment.

3. **Official Social Media API Integration Layer**:
   - Adapter pattern for Instagram Graph API, TikTok Commercial Content API, YouTube Data API, LinkedIn API, and X (Twitter) API v2.
   - AES-256 encrypted storage for OAuth tokens.

4. **Idempotent Publishing & Scheduling**:
   - Two-phase scheduled publishing preventing duplicate broadcasts.
   - Interactive calendar with 7-day visual grid and timezone-aware timestamps.

5. **Double-Entry Credit Ledger**:
   - Strict transactional audit trail (`CreditTransaction`) tracking grants, consumption, and refunds rather than simple mutable balance flags.

6. **Stripe Billing & 7-Day Free Trial**:
   - Monthly and annual tiers (`Starter`, `Growth Pro`, `Agency Enterprise`).
   - Idempotent Stripe webhook ingestion and customer portal redirect.

---

## 🚀 Quickstart Guide

### 1. Prerequisites

- Python 3.11+
- Node.js 18+ (Node 20+ recommended)
- Git
- Docker & Docker Compose (optional, for containerized run)

### 2. Environment Setup

Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```

### 3. Backend API Setup (Python)

Activate your virtual environment and install dependencies:
```powershell
# Windows
.\.venv\Scripts\Activate.ps1
pip install -r apps/api/requirements.txt

# Or Unix/macOS
source .venv/bin/activate
pip install -r apps/api/requirements.txt
```

Initialize and seed the database with demo accounts, content pillars, and schedules:
```powershell
python scripts/seed.py
```

Run the backend FastAPI server:
```powershell
uvicorn apps.api.main:app --reload --port 8000
```
Interactive OpenAPI documentation will be accessible at: `http://localhost:8000/docs`

### 4. Background Worker

In a separate terminal, launch the worker process to handle scheduled posts and background jobs:
```powershell
python apps/worker/main.py
```

### 5. Frontend Web Application (Next.js)

Navigate to `apps/web`, install dependencies, and run development mode:
```powershell
cd apps/web
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔑 Pre-Populated Demo Credentials

For quick evaluation and testing without creating a new Stripe account:

- **Email**: `demo@aisocialstudio.com`
- **Password**: `Password123!`
- **Workspace**: `Apex Growth Studio`
- **Balance**: 750 Credits (Pro Trial Active)
- **1-Click Demo**: Click the **"1-Click Demo Login"** button on the `/login` page to immediately enter the pre-populated dashboard.

---

## 🧪 Running Automated Tests

Run the full backend test suite:
```powershell
.\.venv\Scripts\python.exe -m pytest -v
```

Run Next.js production build and TypeScript check:
```powershell
cd apps/web
npm run build
```

---

## 🐳 Docker Deployment

To run the complete ecosystem (PostgreSQL 16, Redis 7, FastAPI API, Worker, and Next.js Web) with Docker Compose:
```bash
docker-compose up --build -d
```
- Web Application: `http://localhost:3000`
- API & Docs: `http://localhost:8000/docs`
