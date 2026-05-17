from datetime import UTC, datetime, timedelta

from jose import jwt
from jose.exceptions import JWTError
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(subject: str, expires_minutes: int = 60 * 24) -> str:
    expires_at = datetime.now(UTC) + timedelta(minutes=expires_minutes)
    payload = {"sub": subject, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None
    subject = payload.get("sub")
    return str(subject) if subject else None
