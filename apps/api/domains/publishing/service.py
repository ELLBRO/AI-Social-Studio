from datetime import datetime, timezone
import traceback
from sqlalchemy.orm import Session
from apps.api.models.publishing import ScheduledPost, PublishedPost, PostStatus
from apps.api.models.social import SocialAccount
from apps.api.models.media import MediaAsset
from apps.api.domains.social.factory import get_social_adapter
from apps.api.core.security import decrypt_secret
from apps.api.core.exceptions import AppException


class PublishingService:
    @staticmethod
    async def publish_scheduled_post(db: Session, post_id: str) -> PublishedPost:
        post = db.query(ScheduledPost).filter(ScheduledPost.id == post_id).with_for_update().first()
        if not post:
            raise AppException(status_code=404, detail="Scheduled post not found")

        # Idempotency check: if already published, return existing record
        if post.status == PostStatus.PUBLISHED and post.published_post:
            return post.published_post

        if post.status in [PostStatus.CANCELLED]:
            raise AppException(status_code=400, detail="Cannot publish a cancelled post")

        # Transition state to PROCESSING / PUBLISHING
        post.status = PostStatus.PUBLISHING
        db.commit()

        account = db.query(SocialAccount).filter(SocialAccount.id == post.social_account_id).first()
        if not account or not account.credentials:
            post.status = PostStatus.FAILED
            post.last_error = "Connected social account or credentials missing"
            db.commit()
            raise AppException(status_code=400, detail=post.last_error)

        adapter = get_social_adapter(account.platform)
        access_token = decrypt_secret(account.credentials.encrypted_access_token)

        media_url = None
        media_type = "image"
        if post.media_asset_id:
            media = db.query(MediaAsset).filter(MediaAsset.id == post.media_asset_id).first()
            if media:
                media_url = media.url
                if "video" in media.mime_type:
                    media_type = "video"

        try:
            result = await adapter.publish(
                access_token=access_token,
                caption=post.caption,
                media_url=media_url,
                media_type=media_type,
            )

            now = datetime.now(timezone.utc)
            published_record = PublishedPost(
                organization_id=post.organization_id,
                scheduled_post_id=post.id,
                social_account_id=post.social_account_id,
                platform_post_id=result.platform_post_id,
                published_url=result.published_url,
                published_at=now,
                raw_response=result.raw_response,
            )
            db.add(published_record)
            post.status = PostStatus.PUBLISHED
            post.last_error = None
            db.commit()
            db.refresh(published_record)
            return published_record

        except Exception as e:
            post.retry_count += 1
            post.status = PostStatus.FAILED
            post.last_error = f"Publishing failed: {str(e)}\n{traceback.format_exc()}"
            db.commit()
            raise AppException(status_code=502, detail=f"Failed to publish to platform: {str(e)}")
