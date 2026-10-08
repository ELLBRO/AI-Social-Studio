import os
import shutil
import uuid
from typing import BinaryIO, Optional
from apps.api.domains.media.storage.base import StorageProvider
from apps.api.core.config import settings


class LocalStorageProvider(StorageProvider):
    def __init__(self, base_dir: Optional[str] = None):
        self.base_dir = os.path.abspath(base_dir or settings.LOCAL_STORAGE_DIR)
        os.makedirs(self.base_dir, exist_ok=True)

    @property
    def provider_name(self) -> str:
        return "local"

    async def save_file(
        self,
        file_obj: BinaryIO,
        filename: str,
        mime_type: str,
        destination_path: Optional[str] = None,
    ) -> str:
        ext = os.path.splitext(filename)[1].lower()
        unique_name = f"{uuid.uuid4().hex}{ext}"
        if destination_path:
            target_dir = os.path.join(self.base_dir, destination_path)
            os.makedirs(target_dir, exist_ok=True)
            file_key = f"{destination_path}/{unique_name}"
            target_path = os.path.join(target_dir, unique_name)
        else:
            file_key = unique_name
            target_path = os.path.join(self.base_dir, unique_name)

        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file_obj, buffer)

        return file_key

    def get_url(self, file_key: str) -> str:
        # Serves from the API media endpoint
        return f"{settings.API_URL}/api/v1/media/files/{file_key}"

    async def delete_file(self, file_key: str) -> bool:
        full_path = os.path.join(self.base_dir, file_key)
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False
