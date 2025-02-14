FROM node:latest

WORKDIR /usr/src/app

COPY *.json ./ 
RUN npm install

COPY . . 
RUN mkdir /usr/src/app/db/
CMD npm run build && npm start

EXPOSE 4321