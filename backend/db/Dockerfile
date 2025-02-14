FROM alpine

RUN apk add --no-cache bash sqlite 

COPY sample.sql /sample.sql

RUN ["sqlite3", "/data/database.db", ".read /sample.sql"]

CMD ["sleep", "infinity"]