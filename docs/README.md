# Getting started

How to launch the repo locally

```
pnpm install
```

## [Smartcontracts](../packages/tact/)

```
pnpm tact:build
```

## [NextJS](../packages/nextjs/)

```
pnpm nextjs:dev
```

## Backend

```
cd packages/fastapi
poetry install
docker-compose up
task migrate
task dev
```

[More details](backend/)
