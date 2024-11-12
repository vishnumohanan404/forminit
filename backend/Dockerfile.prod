FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install --only=dev

COPY . .

RUN npm run build

FROM node:18-slim

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json /app/

RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
