FROM node:23.7.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . . 
RUN mkdir /usr/src/app/db/
RUN npm install @fastify/rate-limit
RUN npm run build
CMD ["npm", "start"]

