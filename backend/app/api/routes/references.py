from fastapi import APIRouter

from app.data.sample_regulations import SAMPLE_REGULATIONS

router = APIRouter()


@router.get("")
async def list_references() -> list[dict]:
    return SAMPLE_REGULATIONS
