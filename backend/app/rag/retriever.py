from dataclasses import dataclass

from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

from app.core.config import settings


@dataclass(frozen=True)
class RetrievedContext:
    text: str
    regulator: str
    title: str
    citation: str
    url: str | None = None


class RegulatoryRetriever:
    def __init__(self) -> None:
        embeddings = OpenAIEmbeddings(model=settings.openai_embedding_model, api_key=settings.openai_api_key)
        client = QdrantClient(url=settings.qdrant_url)
        self.store = QdrantVectorStore(
            client=client,
            collection_name=settings.qdrant_collection,
            embedding=embeddings,
        )

    async def search(self, query: str, k: int = 6) -> list[RetrievedContext]:
        documents = await self.store.asimilarity_search(query, k=k)
        return [
            RetrievedContext(
                text=doc.page_content,
                regulator=str(doc.metadata.get("regulator", "")),
                title=str(doc.metadata.get("title", "")),
                citation=str(doc.metadata.get("citation", "")),
                url=doc.metadata.get("url"),
            )
            for doc in documents
        ]


class StaticRegulatoryRetriever:
    """Fallback retriever for local development without OpenAI/Qdrant credentials."""

    async def search(self, query: str, k: int = 6) -> list[RetrievedContext]:
        sample = [
            RetrievedContext(
                text="Nigeria payment service providers commonly assess PSSP, MMO, Switching, and Super-Agent permissions depending on wallet, funds custody, and payment processing scope.",
                regulator="Central Bank of Nigeria",
                title="CBN payment system licensing categories",
                citation="CBN licensing framework sample dataset",
                url=None,
            ),
            RetrievedContext(
                text="Cross-border remittance activity can trigger International Money Transfer Operator analysis and AML/CFT controls, including customer due diligence, transaction monitoring, and suspicious transaction reporting.",
                regulator="Central Bank of Nigeria",
                title="CBN remittance and AML obligations",
                citation="CBN AML/CFT and remittance sample dataset",
                url=None,
            ),
            RetrievedContext(
                text="Kenyan payment providers should evidence CBK authorisation status, corporate records, AML policies, consumer protection controls, and settlement arrangements when expanding regionally.",
                regulator="Central Bank of Kenya",
                title="CBK national payment system obligations",
                citation="CBK NPS sample dataset",
                url=None,
            ),
        ]
        return sample[:k]


def get_retriever() -> RegulatoryRetriever | StaticRegulatoryRetriever:
    if settings.openai_api_key:
        return RegulatoryRetriever()
    return StaticRegulatoryRetriever()
