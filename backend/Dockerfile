FROM node:24.2.0-slim

WORKDIR /app

# Root package.json for workspace
COPY package*.json ./

# Copy workspace definitions needed for installing shared packages
COPY backend/package*.json ./backend/
COPY packages/types/package*.json ./packages/types/

# Copy source code of shared package to make it installable
COPY packages/types ./packages/types

# Disable husky prepare as not required for docker

RUN npm install --workspace=backend 

COPY ./backend ./backend

EXPOSE 3000

CMD ["npm", "run", "start:dev", "--workspace=backend"]