import os
import uuid
from typing import BinaryIO, Optional
from apps.api.domains.media.storage.base import StorageProvider
from apps.api.core.config import settings


class S3StorageProvider(StorageProvider):
    def __init__(self):
        self.bucket = settings.S3_BUCKET_NAME
        self.region = settings.AWS_REGION

    @property
    def provider_name(self) -> str:
        return "s3"

    async def save_file(
        self,
        file_obj: BinaryIO,
        filename: str,
        mime_type: str,
        destination_path: Optional[str] = None,
    ) -> str:
        ext = os.path.splitext(filename)[1].lower()
        key = f"{destination_path or 'uploads'}/{uuid.uuid4().hex}{ext}"
        # In production with boto3 credentials:
        # s3_client.upload_fileobj(file_obj, self.bucket, key, ExtraArgs={"ContentType": mime_type})
        return key

    def get_url(self, file_key: str) -> str:
        return f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{file_key}"

    async def delete_file(self, file_key: str) -> bool:
        return True
