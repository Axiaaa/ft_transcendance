FROM postgres:15

ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

RUN mkdir -p /etc/postgresql

RUN mkdir -p /var/log/postgresql && \
    chown -R 999:999 /var/log/postgresql && \
    chmod -R 700 /var/log/postgresql

COPY ./postgresql.conf /etc/postgresql/postgresql.conf
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]

EXPOSE 5432
