FROM node:alpine AS builder
WORKDIR /app/backend

COPY packages/backend/src ./src
COPY packages/backend/package.json packages/backend/tsconfig.json ./
COPY yarn.lock tsconfig.json ../../

RUN ["yarn", "install", "--frozen-lockfile"]
RUN ["yarn", "build"]

FROM node:alpine AS prod
WORKDIR /app/backend

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json .

CMD ["yarn", "start"]
