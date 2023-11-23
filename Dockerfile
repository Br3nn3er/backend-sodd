FROM node:18.6.0-alpine3.15
RUN mkdir -p /app/src && chown -R node:node /app/src
WORKDIR /app
COPY package*.json ./
COPY .env ./
COPY tsconfig.json ./
RUN yarn install
COPY --chown=node:node . .
EXPOSE 3333
CMD ["yarn", "dev"]