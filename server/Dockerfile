FROM node:22-alpine
WORKDIR /app
RUN corepack enable

COPY pnpm-workspace.yaml .
COPY package.json .
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY pnpm-lock.yaml .
COPY server/prisma ./server/prisma
RUN pnpm install

COPY shared ./shared
COPY server ./server

EXPOSE 3000
CMD ["pnpm", "run", "-C", "server", "start"]
