# Postman

There are [Postman](https://www.postman.com/) collections that could help you to work with endpoints

## How to

* Open Postman
* Go to `Collections`
* Press import and paste file [Get2Gether.app.postman\_collection.json](../../packages/fastapi/postman/Get2Gether.app.postman_collection.json)

## Requirements

To make it work, you need to provide specific variables

* `{{base_url}}`, default http://localhost:8000
* `{{init_data}}`, **required**
  for getting value use
  ```
  task generate_telegram_auth_key
  ```
