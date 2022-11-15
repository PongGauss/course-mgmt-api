# Base on offical Node.js Alpine image
FROM node:18.12.1 AS builder

# Set working directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Copy all files
COPY . .

# Install dependencies
RUN yarn install
RUN yarn prisma generate

# Build app
RUN yarn run build

FROM node:18.12.1

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/.env ./dist/

# Expose the listening port
EXPOSE 3003

CMD [ "yarn", "run" ,"start:prod" ]