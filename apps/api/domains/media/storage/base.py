from abc import ABC, abstractmethod
from typing import BinaryIO, Optional


class StorageProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    async def save_file(
        self,
        file_obj: BinaryIO,
        filename: str,
        mime_type: str,
        destination_path: Optional[str] = None,
    ) -> str:
        """Saves file and returns the file_key or relative path."""
        pass

    @abstractmethod
    def get_url(self, file_key: str) -> str:
        """Returns the public or presigned URL for the file."""
        pass

    @abstractmethod
    async def delete_file(self, file_key: str) -> bool:
        """Deletes the stored file."""
        pass
