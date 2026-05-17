from dataclasses import dataclass

from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient, models

from app.core.config import settings


@dataclass(frozen=True)
class RetrievedContext:
    text: str
    regulator: str
    title: str
    citation: str
    country: str | None = None
    category: str | None = None
    license_type: str | None = None
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

    async def search(
        self,
        query: str,
        *,
        country: str | None = None,
        product_type: str | None = None,
        business_type: str | None = None,
        license_category: str | None = None,
        k: int = 8,
    ) -> list[RetrievedContext]:
        filters = []
        if country:
            filters.append(models.FieldCondition(key="metadata.country", match=models.MatchText(text=country)))
        if product_type:
            filters.append(models.FieldCondition(key="metadata.category", match=models.MatchText(text=product_type)))
        if license_category:
            filters.append(models.FieldCondition(key="metadata.license_type", match=models.MatchText(text=license_category)))

        query_filter = models.Filter(should=filters) if filters else None
        documents = await self.store.asimilarity_search(query, k=k, filter=query_filter)
        return [
            RetrievedContext(
                text=doc.page_content,
                regulator=str(doc.metadata.get("regulator", "")),
                title=str(doc.metadata.get("title", "")),
                citation=str(doc.metadata.get("citation", "")),
                country=doc.metadata.get("country"),
                category=doc.metadata.get("category"),
                license_type=doc.metadata.get("license_type"),
                url=doc.metadata.get("url"),
            )
            for doc in documents
        ]


class StaticRegulatoryRetriever:
    """Fallback retriever for local development without OpenAI/Qdrant credentials."""

    async def search(
        self,
        query: str,
        *,
        country: str | None = None,
        product_type: str | None = None,
        business_type: str | None = None,
        license_category: str | None = None,
        k: int = 6,
    ) -> list[RetrievedContext]:
        _ = (query, country, product_type, business_type, license_category)
        sample = [
            RetrievedContext(
                text="Nigeria payment service providers commonly assess PSSP, MMO, Switching, and Super-Agent permissions depending on wallet, funds custody, and payment processing scope.",
                regulator="Central Bank of Nigeria",
                title="CBN payment system licensing categories",
                citation="CBN licensing framework sample dataset",
                country="Nigeria",
                category="Payments/remittance",
                license_type="Payment Service Provider",
                url=None,
            ),
            RetrievedContext(
                text="Cross-border remittance activity can trigger International Money Transfer Operator analysis and AML/CFT controls, including customer due diligence, transaction monitoring, and suspicious transaction reporting.",
                regulator="Central Bank of Nigeria",
                title="CBN remittance and AML obligations",
                citation="CBN AML/CFT and remittance sample dataset",
                country="Nigeria",
                category="AML/KYC",
                license_type="International Money Transfer Operator",
                url=None,
            ),
            RetrievedContext(
                text="Kenyan payment providers should evidence CBK authorisation status, corporate records, AML policies, consumer protection controls, and settlement arrangements when expanding regionally.",
                regulator="Central Bank of Kenya",
                title="CBK national payment system obligations",
                citation="CBK NPS sample dataset",
                country="Kenya",
                category="Payments",
                license_type="Payment Service Provider",
                url=None,
            ),
        ]
        return sample[:k]


def get_retriever() -> RegulatoryRetriever | StaticRegulatoryRetriever:
    if settings.openai_api_key:
        return RegulatoryRetriever()
    return StaticRegulatoryRetriever()
