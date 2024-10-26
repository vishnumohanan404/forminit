FROM node:18-slim

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install
RUN npm install -D tailwindcss postcss autoprefixer
RUN npx tailwindcss init -p

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev-exposed" ]
