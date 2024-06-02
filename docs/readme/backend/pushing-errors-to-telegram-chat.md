---
description: How to setup TELEGRAM_ERROR_CHAT_ID
---

# Pushing errors to Telegram chat

It allows to push error logs into telegram chat

1. Create telegram chat for logs
2. Add telegram bot to this chat
3.  Retrieve chat id for the error logs chat (fastapi server should be stopped)

    ```
    curl https://api.telegram.org/bot<YourBOTToken>/getUpdates
    ```
4.  Set `TELEGRAM_ERROR_CHAT_ID` value in `.env` from the curl output

    ```json
    {
         "update_id": 8393,
         "message": {
             "message_id": 3,
             ...
             "chat": {
                 "id": <group_ID>,  // <-- here
                 "title": "<Group name>"
             },
         }
     }

    ```
