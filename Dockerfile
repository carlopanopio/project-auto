FROM node:20-alpine

WORKDIR /app

# Install client deps and build
COPY client/package*.json ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

# Install server deps
COPY server/package*.json ./server/
RUN cd server && npm install

COPY server/ ./server/

EXPOSE 3001

CMD ["sh", "-c", "node server/src/db/migrate.js && node server/src/index.js"]
