---
description: >-
  Tunnels are needed to make your local endpoints (nextjs/fastapi) being
  accessible to Telegram
---

# Setup tunnels

## With Cloudflare Tunnel

[https://www.cloudflare.com/products/tunnel/](https://www.cloudflare.com/products/tunnel/)

1. Go to dashboard and create tunnel
2. Follow instructions to install and setup `cloudflared`
3.  Launch tunnels with dashboard or `cloudflared`

    ```
    cloudflared --url localhost:3000 
    cloudflared --url localhost:8000
    ```

## With Ngrok

[https://ngrok.com/](https://ngrok.com/)
