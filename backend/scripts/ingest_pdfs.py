import argparse
import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from qdrant_client import QdrantClient

from app.core.config import settings


async def ingest_pdf(path: Path, country: str, regulator: str, title: str) -> None:
    loader = PyPDFLoader(str(path))
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=180)
    chunks = splitter.split_documents(docs)
    for index, chunk in enumerate(chunks):
        chunk.metadata.update(
            {
                "country": country,
                "regulator": regulator,
                "title": title,
                "citation": f"{title}, chunk {index + 1}",
                "source_path": str(path),
            }
        )

    embeddings = OpenAIEmbeddings(model=settings.openai_embedding_model, api_key=settings.openai_api_key)
    client = QdrantClient(url=settings.qdrant_url)
    store = QdrantVectorStore(client=client, collection_name=settings.qdrant_collection, embedding=embeddings)
    await store.aadd_documents(chunks)


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest regulatory PDFs into Qdrant.")
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--country", required=True)
    parser.add_argument("--regulator", required=True)
    parser.add_argument("--title", required=True)
    args = parser.parse_args()
    asyncio.run(ingest_pdf(args.pdf, args.country, args.regulator, args.title))


if __name__ == "__main__":
    main()
