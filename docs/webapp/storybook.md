# Storybook

{% hint style="info" %}
[https://localhost:6006](https://localhost:6006)
{% endhint %}

To make storybook works please edit .env file and provide values as

```
NEXT_PUBLIC_MOCK_TELEGRAM=True
NEXT_PUBLIC_MOCK_INIT_DATA=...
```

as `NEXT_PUBLIC_MOCK_INIT_DATA` you may use this value (faked, generated with `fastapi::task generate_telegram_auth_key`)

{% code overflow="wrap" %}
```
query_id=KSVjxFYIYtcUCDVEYdTOtqOe&user=%7B%22id%22%3A%20-10203172%2C%20%22first_name%22%3A%20%22Alice%22%2C%20%22last_name%22%3A%20%22Adventures%22%2C%20%22username%22%3A%20%22alice%22%2C%20%22language_code%22%3A%20%22en%22%2C%20%22is_premium%22%3A%20true%2C%20%22allows_write_to_pm%22%3A%20true%7D&auth_date=1716275610&hash=37d6c003068105af94cc162de4b0084750ce7dcfcc1911dd5aa374b364ac6bcd
```
{% endcode %}
