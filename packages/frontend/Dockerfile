FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN if [ -d "packages/frontend" ]; then \
      mkdir -p packages/frontend/.next && \
      cp -r .next/static packages/frontend/.next/static && \
      cp -r public packages/frontend/public; \
    fi
EXPOSE 3000
ENV PORT=3000
CMD ["sh", "-c", "node packages/frontend/server.js 2>/dev/null || node server.js"]
