FROM node:20-alpine

WORKDIR /app/frontend

RUN npm install -g typescript

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]