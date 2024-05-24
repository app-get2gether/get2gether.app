# Postman

There are [Postman](https://www.postman.com/) collections that could help you to work with endpoints

## How to

* Open Postman
* Go to `Collections`
* Press import and paste file Get2Gether.app.postman\_collection.json

## Requirements

To make it work, you need to provide specific variables

* `{{base_url}}`
* `{{init_data}}`

#### Generate local `X-Telegram-Auth`Key

```
task generate_telegram_auth_key
```

Go to `Collection > tbot/v1 > Authorization > Auth Type (API Key)` and provide the variable
