FROM dpage/pgadmin4:8.14

ARG PGADMIN_DEFAULT_EMAIL
ARG PGADMIN_DEFAULT_PASSWORD

USER root

RUN chmod -R 777 /pgadmin4


RUN mkdir -p /pgadmin4/logs

RUN chown -R 777 /pgadmin4/logs

COPY ./config_local.py /pgadmin4/config_local.py

EXPOSE 80

