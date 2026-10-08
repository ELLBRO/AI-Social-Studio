from apps.api.core.config import settings
from apps.api.domains.media.storage.base import StorageProvider
from apps.api.domains.media.storage.local import LocalStorageProvider
from apps.api.domains.media.storage.s3 import S3StorageProvider


def get_storage_provider() -> StorageProvider:
    if settings.STORAGE_PROVIDER == "s3" and settings.AWS_ACCESS_KEY_ID:
        return S3StorageProvider()
    return LocalStorageProvider()
