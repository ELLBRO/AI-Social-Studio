import os
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from apps.api.core.database import get_db
from apps.api.core.dependencies import get_current_user, get_current_org
from apps.api.core.exceptions import AppException, NotFoundError
from apps.api.models.user import User, Organization
from apps.api.models.media import MediaAsset
from apps.api.domains.media.storage.factory import get_storage_provider
from apps.api.schemas.media import MediaAssetResponse
from apps.api.core.config import settings

router = APIRouter(prefix="/media", tags=["Media Management"])


@router.post("/upload", response_model=MediaAssetResponse, status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    org: Organization = Depends(get_current_org),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate mime types
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime"]
    if file.content_type not in allowed_types:
        raise AppException(
            status_code=400,
            detail=f"Unsupported media format {file.content_type}. Supported: JPEG, PNG, WEBP, MP4, MOV",
        )

    storage = get_storage_provider()
    dest = f"org_{org.id}"
    file_key = await storage.save_file(
        file_obj=file.file,
        filename=file.filename or "media_asset",
        mime_type=file.content_type,
        destination_path=dest,
    )
    url = storage.get_url(file_key)

    asset = MediaAsset(
        organization_id=org.id,
        user_id=user.id,
        filename=file.filename or "media_asset",
        file_key=file_key,
        mime_type=file.content_type,
        file_size=file.size or 0,
        storage_provider=storage.provider_name,
        url=url,
        thumbnail_url=url if "image" in file.content_type else None,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.get("", response_model=List[MediaAssetResponse])
def get_media_assets(
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    return (
        db.query(MediaAsset)
        .filter(MediaAsset.organization_id == org.id)
        .order_by(MediaAsset.created_at.desc())
        .all()
    )


@router.get("/files/{file_key:path}")
def serve_local_file(file_key: str):
    base_dir = os.path.abspath(settings.LOCAL_STORAGE_DIR)
    full_path = os.path.abspath(os.path.join(base_dir, file_key))

    # Path traversal protection
    if not full_path.startswith(base_dir) or not os.path.exists(full_path):
        raise NotFoundError("Media file not found")

    return FileResponse(full_path)


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(
    asset_id: str,
    org: Organization = Depends(get_current_org),
    db: Session = Depends(get_db),
):
    asset = (
        db.query(MediaAsset)
        .filter(MediaAsset.id == asset_id, MediaAsset.organization_id == org.id)
        .first()
    )
    if not asset:
        raise NotFoundError("Asset not found")

    storage = get_storage_provider()
    await storage.delete_file(asset.file_key)
    db.delete(asset)
    db.commit()
    return None
