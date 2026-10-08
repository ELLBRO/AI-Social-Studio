from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from apps.api.models.user import RoleEnum
from apps.api.schemas.auth import UserResponse


class OrganizationCreate(BaseModel):
    name: str
    industry: Optional[str] = None
    website: Optional[str] = None


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None


class MembershipResponse(BaseModel):
    id: str
    user_id: str
    organization_id: str
    role: RoleEnum
    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


class OrganizationResponse(BaseModel):
    id: str
    name: str
    slug: str
    industry: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    user_role: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AddMemberRequest(BaseModel):
    email: str
    role: RoleEnum = RoleEnum.EDITOR
