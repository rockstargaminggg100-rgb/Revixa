FROM node:20-slim

# Install OpenSSL for Prisma engine compatibility
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /app

# Copy package files & install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code & Prisma schema
COPY . .

# Generate Prisma Client with native & debian binary targets
RUN npx prisma generate

# Expose backend port
EXPOSE 5000

# Start Express API Server
CMD ["node", "src/server.js"]
