FROM postgres:15

ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

RUN mkdir -p /etc/postgresql

RUN chown postgres:postgres /var/log/postgresql/

COPY ./postgresql.conf /etc/postgresql/postgresql.conf

ENV POSTGRES_CONFIG_FILE=/etc/postgresql/postgresql.conf

EXPOSE 5432
