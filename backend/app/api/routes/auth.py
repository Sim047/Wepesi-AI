from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_session
from app.models.domain import User
from app.schemas.auth import LoginRequest, TokenResponse, UserCreate, UserResponse

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
async def register(payload: UserCreate, session: AsyncSession = Depends(get_session)) -> TokenResponse:
    existing = await session.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user_count = await session.scalar(select(func.count()).select_from(User))
    user = User(
        email=str(payload.email),
        password_hash=hash_password(payload.password),
        company_name=payload.company_name,
        role="admin" if user_count == 0 else "user",
    )
    session.add(user)
    await session.commit()
    return TokenResponse(access_token=create_access_token(str(user.id)))


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_session)) -> TokenResponse:
    user = await session.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=create_access_token(str(user.id)))


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        company_name=current_user.company_name,
        role=current_user.role,
    )
