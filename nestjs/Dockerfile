FROM node:24-alpine

WORKDIR /app

# Install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# ---> THE CRITICAL FIX <---
# Explicitly run prisma generate AFTER the schema has been copied
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 3000

# The command to run the application
CMD ["node", "dist/main"]