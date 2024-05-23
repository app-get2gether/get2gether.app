import hashlib
import hmac
import json
from urllib.parse import quote

from app.settings import settings


def generate_telegram_auth_key() -> str:
    """
    Generates faked Telegram api key for testing purposes
    """
    data = {
        "query_id": "KSVjxFYIYtcUCDVEYdTOtqOe",
        "user": json.dumps(
            {
                "id": "-10203172",
                "first_name": "Alice",
                "last_name": "Adventures",
                "username": "alice",
                "language_code": "en",
                "is_premium": True,
                "allows_write_to_pm": True,
            }
        ),
        "auth_date": 1716275610,
    }

    raw = "\n".join([f"{k}={data[k]}" for k in sorted(data.keys())])
    secret_key = hmac.new(
        b"WebAppData", settings.TELEGRAM_TOKEN.encode(), hashlib.sha256
    ).digest()
    result_hash = hmac.new(secret_key, raw.encode(), hashlib.sha256).hexdigest()
    return (
        "&".join([f"{k}={quote(str(v))}" for k, v in data.items()])
        + f"&hash={result_hash}"
    )
