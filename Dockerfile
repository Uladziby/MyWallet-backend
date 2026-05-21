# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres yarn build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "start:prod"]
