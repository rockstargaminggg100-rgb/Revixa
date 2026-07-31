FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy package files & install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code & Prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose backend port
EXPOSE 5000

# Start Express API Server
CMD ["node", "src/server.js"]
