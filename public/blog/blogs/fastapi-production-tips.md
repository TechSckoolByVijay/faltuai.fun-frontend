# Python FastAPI Production Tips

FastAPI is fast out of the box, but production-readiness needs extra attention.

## Essential additions

- Add lifespan handlers for DB pool startup/teardown
- Use `Depends()` for auth, DB sessions, and rate limiting
- Return consistent error shapes via `HTTPException` + custom handlers
- Enable structured JSON logging for cloud observability

## Example dependency

```python
from fastapi import Depends, HTTPException, status
from app.core.security import verify_token

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user
```

## Performance checklist

- Use async DB drivers (`asyncpg`, `motor`)
- Set `workers` in Gunicorn/Uvicorn based on CPU count
- Profile slow endpoints with `py-spy` or OpenTelemetry traces

![Python FastAPI Production Tips](/blog/blogs/images/fastapi-production-tips_01.svg)

### Final thought

Correctness first, performance second — but don't skip observability.
