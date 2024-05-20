# Getting started

How to launch the repo locally

```
pnpm install
```

## [Smartcontracts](./packages/tact)
```
pnpm tact:build
```

## [NextJS](./packages/next)
```
pnpm next:dev
```

## [FastAPI](./packages/fastapi)
```
cd packages/fastapi
poetry install
task dev
```

## Setup tunnels

Tunnels are needed to make your local endpoints (nextjs/fastapi) being accessible to Telegram

### With Cloudflare Tunnel

https://www.cloudflare.com/products/tunnel/  

1. Go to dashboard and create tunnel
2. Follow instructions to install and setup `cloudflared`
3. Launch tunnels with dashboard or `cloudflared`
   ```
   cloudflared --url localhost:3000 
   cloudflared --url localhost:8000
   ```

### With Ngrok

https://ngrok.com/
