FROM node:alpine AS builder
WORKDIR /app/frontend

COPY packages/frontend/src ./src
COPY packages/frontend/public ./public
COPY packages/frontend/package.json packages/frontend/tsconfig.json ./
COPY yarn.lock tsconfig.json ../../

RUN ["yarn", "install", "--frozen-lockfile"]
RUN ["yarn", "build"]

FROM nginx:alpine AS prod
WORKDIR /public

COPY --from=builder /app/frontend/build ./

CMD ["nginx", "-g", "daemon off;"]