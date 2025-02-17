FROM alpine

RUN apk add --no-cache bash sqlite 

COPY sample.sql /sample.sql

RUN mkdir -p /data && sqlite3 /data/database.db < /sample.sql

CMD ["sleep", "infinity"]