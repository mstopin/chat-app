FROM node:alpine AS builder
WORKDIR /app/ws

COPY packages/ws/src ./src
COPY packages/ws/package.json packages/backend/tsconfig.json ./
COPY yarn.lock tsconfig.json ../../

RUN ["yarn", "install", "--frozen-lockfile"]
RUN ["yarn", "build"]

FROM node:alpine AS prod
WORKDIR /app/backend

COPY --from=builder /app/ws/dist ./dist
COPY --from=builder /app/ws/node_modules ./node_modules
COPY --from=builder /app/ws/package.json .

CMD ["yarn", "start"]
