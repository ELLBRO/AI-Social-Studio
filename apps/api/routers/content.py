from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_user, get_current_org
from apps.api.core.exceptions import NotFoundError
from apps.api.models.user import User, Organization
from apps.api.models.content import Content, ContentIdea, Hook, Script, Caption, Hashtag, AIRequest
from apps.api.domains.credits.service import CreditService
from apps.api.domains.ai.services.strategy_service import ContentStrategyService
from apps.api.domains.ai.services.idea_service import ContentIdeaService
from apps.api.domains.ai.services.hook_service import HookGenerationService
from apps.api.domains.ai.services.script_service import ScriptGenerationService
from apps.api.domains.ai.services.caption_service import CaptionGenerationService
from apps.api.domains.ai.services.hashtag_service import HashtagGenerationService
from apps.api.schemas.content import (
    ContentStrategyRequest,
    ContentStrategyResponse,
    ContentIdeaRequest,
    ContentIdeaResponse,
    HookRequest,
    HookResponse,
    ScriptRequest,
    ScriptResponse,
    CaptionRequest,
    CaptionResponse,
    HashtagRequest,
    HashtagResponse,
    ContentCreate,
    ContentUpdate,
    ContentResponse,
)

router = APIRouter(prefix="/content", tags=["Content & AI Generation"])


# --- AI Generation Endpoints (Provider-independent, Ledger-credited) ---

@router.post("/generate-strategy", response_model=ContentStrategyResponse)
async def generate_strategy(
    req: ContentStrategyRequest,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    CreditService.deduct_credits(
        db, org.id, amount=15, description="AI Content Strategy Generation", reference_type="strategy"
    )
    service = ContentStrategyService()
    res = await service.generate_strategy(req)
    
    # Track AI request
    ai_log = AIRequest(
        organization_id=org.id,
        user_id=user.id,
        provider="abstracted",
        model="standard-llm",
        task_type="strategy",
        total_tokens=650,
        estimated_cost=0.015,
    )
    db.add(ai_log)
    db.commit()
    return res


@router.post("/generate-ideas", response_model=List[ContentIdeaResponse])
async def generate_ideas(
    req: ContentIdeaRequest,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    CreditService.deduct_credits(
        db, org.id, amount=10, description=f"AI Content Ideas Generation ({req.niche})", reference_type="ideas"
    )
    service = ContentIdeaService()
    ideas = await service.generate_ideas(req)

    # Persist generated ideas to organization library
    for idea in ideas:
        record = ContentIdea(
            organization_id=org.id,
            user_id=user.id,
            title=idea.title,
            description=idea.description,
            angle=idea.angle,
            target_audience=idea.target_audience,
            estimated_engagement=idea.estimated_engagement,
            tags=idea.tags,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        idea.id = record.id

    return ideas


@router.post("/generate-hooks", response_model=List[HookResponse])
async def generate_hooks(
    req: HookRequest,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    CreditService.deduct_credits(
        db, org.id, amount=5, description=f"AI Viral Hooks ({req.topic[:30]})", reference_type="hooks"
    )
    service = HookGenerationService()
    hooks = await service.generate_hooks(req)

    for h in hooks:
        record = Hook(
            organization_id=org.id,
            hook_text=h.hook_text,
            hook_type=h.hook_type,
            score=h.score,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        h.id = record.id

    return hooks


@router.post("/generate-script", response_model=ScriptResponse)
async def generate_script(
    req: ScriptRequest,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    CreditService.deduct_credits(
        db, org.id, amount=10, description=f"AI Video Script ({req.topic[:30]})", reference_type="script"
    )
    service = ScriptGenerationService()
    script = await service.generate_script(req)

    record = Script(
        organization_id=org.id,
        script_type="short_form",
        scenes_or_sections=[s.model_dump() for s in script.scenes],
        full_text=script.full_text,
        duration_estimate=script.duration_estimate,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    script.id = record.id

    return script


@router.post("/generate-caption", response_model=CaptionResponse)
async def generate_caption(
    req: CaptionRequest,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    CreditService.deduct_credits(
        db, org.id, amount=5, description=f"AI Caption ({req.platform})", reference_type="caption"
    )
    service = CaptionGenerationService()
    caption = await service.generate_caption(req)

    record = Caption(
        organization_id=org.id,
        platform=caption.platform,
        text=caption.text,
        call_to_action=caption.call_to_action,
        character_count=caption.character_count,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    caption.id = record.id

    return caption


@router.post("/generate-hashtags", response_model=HashtagResponse)
async def generate_hashtags(
    req: HashtagRequest,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    CreditService.deduct_credits(
        db, org.id, amount=5, description=f"AI Hashtag Strategy ({req.niche})", reference_type="hashtags"
    )
    service = HashtagGenerationService()
    return await service.generate_hashtags(req)


# --- Content Library Management ---

@router.get("/items", response_model=List[ContentResponse])
def get_contents(
    status_filter: Optional[str] = None,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    query = db.query(Content).filter(Content.organization_id == org.id)
    if status_filter:
        query = query.filter(Content.status == status_filter)
    return query.order_by(Content.created_at.desc()).all()


@router.post("/items", response_model=ContentResponse, status_code=status.HTTP_201_CREATED)
def create_content(
    payload: ContentCreate,
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = Content(
        organization_id=org.id,
        user_id=user.id,
        title=payload.title,
        status=payload.status,
        content_type=payload.content_type,
        data=payload.data,
        tags=payload.tags,
    )
    db.add(content)
    db.commit()
    db.refresh(content)
    return content


@router.put("/items/{content_id}", response_model=ContentResponse)
def update_content(
    content_id: str,
    payload: ContentUpdate,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    content = (
        db.query(Content)
        .filter(Content.id == content_id, Content.organization_id == org.id)
        .first()
    )
    if not content:
        raise NotFoundError("Content item not found")

    if payload.title is not None:
        content.title = payload.title
    if payload.content_type is not None:
        content.content_type = payload.content_type
    if payload.status is not None:
        content.status = payload.status
    if payload.data is not None:
        content.data = payload.data
    if payload.tags is not None:
        content.tags = payload.tags

    db.commit()
    db.refresh(content)
    return content
