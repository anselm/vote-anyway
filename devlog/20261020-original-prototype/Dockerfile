FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY server ./server
COPY public ./public
COPY scripts/verify-log.mjs ./scripts/verify-log.mjs
RUN mkdir -p /app/data && chown -R node:node /app
USER node
ENV PORT=3000
EXPOSE 3000
CMD ["node","server/index.mjs"]
