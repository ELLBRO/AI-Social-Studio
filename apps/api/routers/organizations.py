from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_user, get_current_org, require_role
from apps.api.core.exceptions import NotFoundError, ConflictError
from apps.api.models.user import User, Organization, Membership, RoleEnum
from apps.api.schemas.organization import OrganizationResponse, OrganizationCreate, OrganizationUpdate, MembershipResponse, AddMemberRequest

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.get("/my", response_model=List[OrganizationResponse])
def get_user_organizations(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    memberships = db.query(Membership).filter(Membership.user_id == current_user.id).all()
    res = []
    for m in memberships:
        org = m.organization
        res.append(
            OrganizationResponse(
                id=org.id,
                name=org.name,
                slug=org.slug,
                industry=org.industry,
                website=org.website,
                logo_url=org.logo_url,
                user_role=m.role.value,
            )
        )
    return res


@router.get("/current", response_model=OrganizationResponse)
def get_current_organization(
    org: Organization = Depends(get_current_org),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    membership = (
        db.query(Membership)
        .filter(Membership.user_id == current_user.id, Membership.organization_id == org.id)
        .first()
    )
    return OrganizationResponse(
        id=org.id,
        name=org.name,
        slug=org.slug,
        industry=org.industry,
        website=org.website,
        logo_url=org.logo_url,
        user_role=membership.role.value if membership else "member",
    )


@router.put("/current", response_model=OrganizationResponse)
def update_current_organization(
    payload: OrganizationUpdate,
    org: Organization = Depends(get_current_org),
    _role: Membership = Depends(require_role([RoleEnum.OWNER, RoleEnum.ADMIN])),
    db: Session = Depends(get_db),
):
    if payload.name is not None:
        org.name = payload.name
    if payload.industry is not None:
        org.industry = payload.industry
    if payload.website is not None:
        org.website = payload.website
    if payload.logo_url is not None:
        org.logo_url = payload.logo_url

    db.commit()
    db.refresh(org)
    return OrganizationResponse(
        id=org.id,
        name=org.name,
        slug=org.slug,
        industry=org.industry,
        website=org.website,
        logo_url=org.logo_url,
        user_role=_role.role.value,
    )


@router.get("/members", response_model=List[MembershipResponse])
def get_organization_members(
    org: Organization = Depends(get_current_org), db: Session = Depends(get_db)
):
    return db.query(Membership).filter(Membership.organization_id == org.id).all()


@router.post("/members", response_model=MembershipResponse, status_code=status.HTTP_201_CREATED)
def add_member(
    payload: AddMemberRequest,
    org: Organization = Depends(get_current_org),
    _role: Membership = Depends(require_role([RoleEnum.OWNER, RoleEnum.ADMIN])),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise NotFoundError("User not found with this email")

    existing = (
        db.query(Membership)
        .filter(Membership.user_id == user.id, Membership.organization_id == org.id)
        .first()
    )
    if existing:
        raise ConflictError("User is already a member of this workspace")

    membership = Membership(user_id=user.id, organization_id=org.id, role=payload.role)
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership
