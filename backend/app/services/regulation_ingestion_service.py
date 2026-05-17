import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from qdrant_client import QdrantClient, models
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.domain import RegulationDocument, RegulatoryChunk, User

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".md", ".markdown"}


class RegulationIngestionService:
    async def ingest(
        self,
        session: AsyncSession,
        *,
        country_name: str,
        regulator_name: str,
        regulation_category: str,
        license_type: str,
        document_title: str,
        source_url: str | None,
        notes: str | None,
        upload: UploadFile,
        current_user: User,
    ) -> RegulationDocument:
        extension = Path(upload.filename or "").suffix.lower()
        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF, TXT, and Markdown files are supported")

        content = await upload.read()
        if len(content) > settings.max_upload_bytes:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Uploaded file is too large")

        upload_root = Path(settings.upload_dir)
        upload_root.mkdir(parents=True, exist_ok=True)
        stored_name = f"{uuid.uuid4()}{extension}"
        stored_path = upload_root / stored_name
        stored_path.write_bytes(content)

        text = self._extract_text(stored_path, extension)
        if not text.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not extract text from uploaded file")

        document = RegulationDocument(
            country_name=country_name,
            regulator_name=regulator_name,
            regulation_category=regulation_category,
            license_type=license_type,
            document_title=document_title,
            source_url=source_url,
            notes=notes,
            stored_file_path=str(stored_path),
            original_filename=upload.filename or stored_name,
            content_type=upload.content_type or "application/octet-stream",
            uploaded_by_user_id=current_user.id,
        )
        session.add(document)
        await session.flush()

        chunks = self._chunk_text(text)
        qdrant_ids = await self._store_in_qdrant(
            chunks,
            country_name=country_name,
            regulator_name=regulator_name,
            regulation_category=regulation_category,
            license_type=license_type,
            document_title=document_title,
            source_url=source_url,
            document_id=str(document.id),
        )

        for index, chunk in enumerate(chunks):
            metadata = {
                "country": country_name,
                "regulator": regulator_name,
                "category": regulation_category,
                "license_type": license_type,
                "title": document_title,
                "source_url": source_url,
                "document_id": str(document.id),
                "chunk_index": index,
            }
            session.add(
                RegulatoryChunk(
                    country=country_name,
                    regulator=regulator_name,
                    category=regulation_category,
                    license_type=license_type,
                    title=document_title,
                    chunk_text=chunk,
                    qdrant_point_id=qdrant_ids[index] if index < len(qdrant_ids) else None,
                    metadata_json=metadata,
                )
            )

        await session.commit()
        await session.refresh(document)
        return document

    def _extract_text(self, path: Path, extension: str) -> str:
        if extension == ".pdf":
            reader = PdfReader(str(path))
            return "\n\n".join(page.extract_text() or "" for page in reader.pages)
        return path.read_text(encoding="utf-8", errors="ignore")

    def _chunk_text(self, text: str) -> list[str]:
        splitter = RecursiveCharacterTextSplitter(chunk_size=1100, chunk_overlap=180)
        return splitter.split_text(text)

    async def _store_in_qdrant(self, chunks: list[str], **metadata: str | None) -> list[str]:
        if not settings.openai_api_key:
            return [str(uuid.uuid4()) for _ in chunks]

        embeddings = OpenAIEmbeddings(model=settings.openai_embedding_model, api_key=settings.openai_api_key)
        client = QdrantClient(url=settings.qdrant_url)
        ids = [str(uuid.uuid4()) for _ in chunks]
        vectors = await embeddings.aembed_documents(chunks)
        if not client.collection_exists(settings.qdrant_collection):
            client.create_collection(
                collection_name=settings.qdrant_collection,
                vectors_config=models.VectorParams(size=len(vectors[0]), distance=models.Distance.COSINE),
            )
        client.upsert(
            collection_name=settings.qdrant_collection,
            points=[
                models.PointStruct(
                    id=ids[index],
                    vector=vector,
                    payload={
                        "page_content": chunks[index],
                        "metadata": {
                            "country": metadata["country_name"],
                            "regulator": metadata["regulator_name"],
                            "category": metadata["regulation_category"],
                            "license_type": metadata["license_type"],
                            "title": metadata["document_title"],
                            "citation": metadata["document_title"],
                            "url": metadata["source_url"],
                            "document_id": metadata["document_id"],
                            "chunk_index": index,
                        },
                    },
                )
                for index, vector in enumerate(vectors)
            ],
        )
        return ids
