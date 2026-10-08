# AI SOCIAL STUDIO — FULL PRODUCTION BUILD

You are the lead engineer responsible for building this project from A to Z.

The project is a commercial SaaS called AI Social Studio.

IMPORTANT:
You are authorized to IMPLEMENT the application.

Your job is to inspect the existing project first, then build the product progressively into a working production-quality SaaS.

Do not merely describe code.
Actually create and modify the required files.

Do not ask for approval after every small step.
Work autonomously through the development phases.

However:
- Never delete important existing work without checking it first.
- Never overwrite useful existing code blindly.
- Never install unnecessary packages.
- Prefer stable, well-maintained dependencies.
- Keep the architecture modular.
- Keep the code production-ready.
- Run validation/tests after major changes.
- Fix errors you introduce.
- Keep a clear implementation log.
- If a required external credential/API key is missing, implement the integration correctly with environment variables and safe placeholders, then continue with everything that can be developed locally.
- Never hardcode secrets.
- Never commit secrets.
- Never use unofficial social-media APIs.
- Never bypass platform restrictions.

==================================================
PRODUCT
==================================================

AI Social Studio is an AI Social Media Growth Platform for the US market.

The platform should eventually support:

- AI content strategy
- AI content ideas
- AI hooks
- AI scripts
- AI video generation
- AI captions
- AI hashtags
- Content calendar
- Social media account connections
- Scheduling
- Publishing through official APIs
- Analytics
- AI performance analysis
- Automatic content optimization
- Future AI Autopilot

==================================================
PREFERRED STACK
==================================================

Frontend:
- Next.js
- TypeScript
- Modern React
- Tailwind CSS
- Production-quality responsive UI

Backend:
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic

Database:
- PostgreSQL

Infrastructure:
- Docker / Docker Compose for local development
- Background job system
- Object storage abstraction

AI:
- Provider-independent architecture
- Multiple AI providers must be supportable without rewriting business logic

Video:
- Provider-independent video architecture

Billing:
- Stripe

Business model:
- 7-day free trial
- Subscription plans
- Credits / usage system

==================================================
PHASE 0 — INSPECT FIRST
==================================================

Before changing anything:

Inspect:

1. Python version
2. Node.js version
3. npm version
4. pnpm availability
5. Git version
6. Docker availability
7. Current directory
8. Complete current folder structure
9. Git status
10. Existing package files
11. Existing configuration
12. Existing source code
13. Existing environment files
14. Existing database configuration
15. Existing Docker configuration

Do not install packages before understanding the existing project.

Preserve useful existing work.

==================================================
PHASE 1 — ARCHITECTURE
==================================================

Establish a clean production architecture.

Prefer a monorepo structure similar to:

/

  apps/
    web/
    api/
    worker/

  packages/
    shared/
    config/

  infrastructure/
    docker/

  docs/

  scripts/

  .env.example
  docker-compose.yml
  README.md

Adapt this structure if the existing project requires something better.

Frontend and backend must remain clearly separated.

==================================================
PHASE 2 — FRONTEND
==================================================

Build a polished SaaS dashboard.

The UI should feel like a serious commercial US SaaS product.

Create:

Public pages:
- Landing page
- Pricing
- Login
- Signup
- Forgot password
- Terms
- Privacy

Authenticated application:
- Dashboard
- Content strategy
- Content ideas
- Hooks
- Scripts
- Captions
- Hashtags
- Content editor
- Media library
- Video generation
- Content calendar
- Social accounts
- Scheduled posts
- Published posts
- Analytics
- AI performance analysis
- Optimization recommendations
- Billing
- Settings
- Workspace/team settings

Use:
- Responsive design
- Good empty states
- Loading states
- Error states
- Toast notifications
- Confirmation dialogs
- Accessible forms
- Consistent design system

Do not make fake buttons that appear functional but do nothing.

==================================================
PHASE 3 — BACKEND
==================================================

Build the FastAPI backend with modular domain architecture.

Suggested domains:

- auth
- users
- organizations
- memberships
- content
- ai
- media
- video
- calendar
- social
- publishing
- analytics
- optimization
- billing
- credits
- usage
- jobs
- webhooks
- audit

Use:
- dependency injection
- Pydantic schemas
- service layer
- repository/data-access patterns where useful
- centralized error handling
- structured logging
- API versioning

Use:

/api/v1/

for application APIs.

==================================================
PHASE 4 — AUTHENTICATION
==================================================

Implement secure authentication.

Support:

- Signup
- Login
- Logout
- Password hashing
- Password reset architecture
- Email verification architecture
- Sessions/tokens
- Protected routes
- User profile
- Workspace membership

Implement multi-tenant isolation.

A user must never be able to access another organization's data.

Add authorization checks at the backend level.

Never trust frontend authorization.

==================================================
PHASE 5 — DATABASE
==================================================

Implement PostgreSQL using SQLAlchemy and Alembic.

Create a normalized, production-quality schema.

Core entities should include:

- User
- Organization
- Membership
- Role
- Subscription
- Plan
- CreditAccount
- CreditTransaction
- UsageRecord
- AIRequest
- Content
- ContentIdea
- Hook
- Script
- Caption
- Hashtag
- MediaAsset
- VideoGeneration
- CalendarItem
- SocialPlatform
- SocialAccount
- SocialCredential
- ScheduledPost
- PublishedPost
- AnalyticsSnapshot
- PostAnalytics
- PerformanceAnalysis
- OptimizationRecommendation
- Job
- WebhookEvent
- AuditLog

Use:
- UUID identifiers where appropriate
- timestamps
- foreign keys
- indexes
- unique constraints
- soft deletion where appropriate
- organization_id for tenant-owned entities

Create Alembic migrations.

==================================================
PHASE 6 — AI ARCHITECTURE
==================================================

IMPORTANT:

Business logic must NEVER directly depend on one AI provider.

Create an abstraction such as:

AIProvider

with provider implementations.

Support future providers including:

- OpenAI
- Anthropic
- Google
- Other providers
- Local models

Create task-level services such as:

ContentStrategyService
ContentIdeaService
HookGenerationService
ScriptGenerationService
CaptionGenerationService
HashtagGenerationService
PerformanceAnalysisService

The services should depend on an AI abstraction, not a specific provider.

Implement:

- structured outputs
- validation
- retries
- timeouts
- provider fallback
- model configuration
- token usage tracking
- cost tracking
- credit consumption
- prompt versioning
- request logging
- error handling

Never hardcode provider API keys.

Use environment variables.

==================================================
PHASE 7 — CONTENT ENGINE
==================================================

Implement workflows for:

Content Strategy:

Input:
- brand
- niche
- target audience
- goals
- platforms
- tone
- content preferences

Output:
- content pillars
- positioning
- recommended formats
- posting strategy
- content themes

Content Ideas:

Generate structured content ideas.

Hooks:

Generate multiple hooks per idea.

Scripts:

Generate platform-aware scripts.

Captions:

Generate captions adapted to platform and content.

Hashtags:

Generate relevant hashtag sets.

All generated content must be editable by the user.

Users must be able to save generated results.

==================================================
PHASE 8 — MEDIA
==================================================

Implement media abstraction.

Support:

- uploads
- media metadata
- images
- videos
- thumbnails
- object storage abstraction

Do not tightly couple business logic to one storage provider.

Prepare support for:
- S3-compatible storage
- Cloud object storage

Validate:
- file type
- file size
- ownership
- access permissions

Never expose private media directly without authorization.

==================================================
PHASE 9 — VIDEO ARCHITECTURE
==================================================

Create provider-independent video generation.

Implement:

VideoProvider interface

and provider adapters.

Support future:

- text-to-video
- image-to-video
- AI video providers
- processing/transcoding providers

Video generation must be asynchronous.

Create:

- generation request
- job
- status
- progress
- provider request ID
- result asset
- error state
- retries

Prepare webhook handling.

Do not assume a video provider is always available.

==================================================
PHASE 10 — BACKGROUND JOBS
==================================================

Implement a background-job architecture.

Jobs should support:

- AI generation
- video generation
- video processing
- scheduled publishing
- analytics sync
- token refresh
- webhook processing
- performance analysis

Jobs must support:

- retries
- exponential backoff
- idempotency
- failure states
- logging

Never perform long-running AI/video tasks directly inside normal HTTP requests.

==================================================
PHASE 11 — SOCIAL INTEGRATIONS
==================================================

Create a provider-independent social integration layer.

Prepare adapters for:

- Instagram
- Facebook
- TikTok
- YouTube
- LinkedIn
- X

Use official APIs only.

Implement architecture for:

- OAuth
- account connection
- token storage
- refresh
- permissions
- account discovery
- media upload
- publishing
- scheduled publishing
- analytics
- webhook events
- rate limits
- provider errors

Tokens must be encrypted or securely protected.

Do not expose access tokens to the frontend.

If credentials are unavailable, build the integration layer and mock/test adapters without pretending that real publishing works.

==================================================
PHASE 12 — CONTENT CALENDAR
==================================================

Implement:

- calendar view
- month/week/day views
- draft content
- scheduled content
- published content
- drag/drop where appropriate
- platform filters
- content status
- scheduling
- editing
- rescheduling

Scheduling must use server-side timestamps and timezone-aware logic.

==================================================
PHASE 13 — PUBLISHING
==================================================

Create a publishing service.

A scheduled post should move through states such as:

draft
scheduled
processing
publishing
published
failed
cancelled

Publishing must be idempotent.

Do not publish the same post twice because of a retry.

Store provider IDs and publishing results.

==================================================
PHASE 14 — ANALYTICS
==================================================

Implement analytics architecture.

Support:

- impressions
- reach
- views
- likes
- comments
- shares
- saves
- engagement
- follower growth
- post performance

Store historical snapshots.

Separate:

raw provider data

from

normalized analytics data.

Create normalized metrics that can work across multiple platforms.

==================================================
PHASE 15 — AI PERFORMANCE ANALYSIS
==================================================

Build an AI analytics service.

Analyze:

- hooks
- topics
- formats
- captions
- hashtags
- posting times
- engagement
- views
- audience response

Generate:

- insights
- recommendations
- winning patterns
- weak patterns
- suggested experiments
- future content recommendations

Do not let AI directly mutate important data without validation.

==================================================
PHASE 16 — OPTIMIZATION
==================================================

Build an optimization system.

Example recommendations:

- improve hook
- shorten introduction
- change format
- change CTA
- adjust caption
- change posting time
- reuse winning topic
- test alternative hook

Recommendations should be stored and explainable.

==================================================
PHASE 17 — BILLING
==================================================

Implement Stripe architecture.

Plans should support:

- monthly
- yearly
- free trial

Trial:

7 days.

Implement:

- checkout
- subscription creation
- subscription updates
- cancellation
- upgrade
- downgrade
- failed payment handling
- Stripe webhook processing
- subscription synchronization

Never trust the frontend for billing state.

Stripe webhooks are authoritative for Stripe events.

==================================================
PHASE 18 — CREDITS
==================================================

Implement a proper credit ledger.

Do NOT rely only on:

user.credit_balance

Instead maintain transaction history.

Support:

- credit grants
- credit consumption
- reservations
- refunds
- expiration if required
- usage tracking
- idempotency

Expensive operations should reserve/consume credits safely.

Examples:

AI generation
Video generation
Future image generation

==================================================
PHASE 19 — SECURITY
==================================================

Apply production security practices.

Include:

- secure password hashing
- authorization
- tenant isolation
- input validation
- rate limiting architecture
- CORS
- CSRF protection where applicable
- secure cookies/tokens
- encrypted secrets
- webhook signature validation
- audit logs
- secure file uploads
- API abuse protection
- SQL injection protection
- XSS protection
- secure headers

Never commit secrets.

Create:

.env.example

with safe placeholder values.

==================================================
PHASE 20 — TESTING
==================================================

Create tests throughout development.

Backend:

- unit tests
- API tests
- database tests
- authentication tests
- authorization tests
- billing tests
- credit tests
- AI service tests
- social integration adapter tests

Frontend:

- component tests where useful
- critical workflow tests

Integration tests:

- signup
- login
- content generation
- calendar
- scheduling
- credits
- billing webhooks

Mock external APIs in tests.

==================================================
PHASE 21 — DEVELOPMENT ENVIRONMENT
==================================================

Create a practical local development environment.

Use Docker Compose where appropriate for:

- PostgreSQL
- Redis/job infrastructure if selected
- local object storage if useful

Do not force unnecessary infrastructure.

Provide:

.env.example

README setup instructions.

Document:

- prerequisites
- environment variables
- database setup
- migrations
- running frontend
- running backend
- running worker
- tests

==================================================
PHASE 22 — OBSERVABILITY
==================================================

Implement useful logging and error tracking architecture.

Track:

- request IDs
- job IDs
- AI requests
- provider failures
- publishing failures
- webhook failures
- billing events
- credit transactions

Never log secrets or access tokens.

==================================================
PHASE 23 — FUTURE AUTOPILOT
==================================================

Prepare architecture for a future AI Autopilot.

Do NOT implement full Autopilot yet.

The architecture should eventually allow:

Analyze performance
→ decide what to create
→ generate idea
→ generate hook
→ generate script
→ generate video
→ generate caption
→ schedule
→ publish
→ analyze results
→ optimize

Keep this workflow modular so it can be orchestrated later.

==================================================
ENGINEERING RULES
==================================================

Follow these rules throughout the project:

1. Inspect before modifying.
2. Preserve existing useful work.
3. Keep frontend/backend separation.
4. Keep business logic independent of infrastructure providers.
5. Keep AI provider-independent.
6. Keep video provider-independent.
7. Keep storage provider-independent.
8. Keep social providers behind adapters.
9. Use official APIs.
10. Never hardcode secrets.
11. Never commit secrets.
12. Use migrations for database changes.
13. Use typed schemas.
14. Validate external API responses.
15. Make background jobs idempotent.
16. Make publishing idempotent.
17. Make billing webhook processing idempotent.
18. Make credit transactions auditable.
19. Test critical business logic.
20. Do not create fake functionality that claims to work.
21. Do not leave obvious TODO placeholders for core functionality.
22. Keep the UI polished.
23. Keep APIs documented.
24. Keep README documentation updated.
25. Run linting/type checks/tests after major implementation phases.
26. Fix errors before moving forward.
27. Do not install packages unless they are actually needed.
28. Prefer simple architecture over unnecessary complexity.

==================================================
IMPLEMENTATION ORDER
==================================================

Implement in this order unless the existing project requires a better dependency order:

1. Inspect existing project
2. Establish architecture
3. Project structure
4. Database foundation
5. Backend foundation
6. Frontend foundation
7. Authentication
8. Organizations/workspaces
9. Content domain
10. AI abstraction
11. AI content generation
12. Media
13. Calendar
14. Background jobs
15. Social integration framework
16. Scheduling
17. Publishing
18. Analytics
19. AI performance analysis
20. Optimization
21. Stripe
22. Credits
23. Security hardening
24. Testing
25. Docker/local environment
26. Documentation
27. Final validation

==================================================
IMPORTANT EXECUTION RULE
==================================================

Do not stop after writing an architecture document.

Actually implement the application.

Do not wait for approval between normal development phases.

Continue until the project has a coherent working MVP foundation.

If an external service requires credentials that are not available:

- implement the production adapter
- add environment variables
- add mocks/fakes for local development
- add tests
- continue with the rest of the implementation

At the end:

1. Run available tests.
2. Run type checking.
3. Run linting.
4. Check migrations.
5. Check Git status.
6. Report what was implemented.
7. Report what could not be completed because of missing external credentials/services.
8. Report exact commands needed to run the project.
9. Report any remaining risks.

The goal is a real, maintainable commercial SaaS foundation — not a demo or a collection of mock screens.