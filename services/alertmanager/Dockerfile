FROM prom/alertmanager:latest

USER '0'

ARG DISCORD_WEBHOOK_URL=${DISCORD_WEBHOOK_URL}

COPY ./config/alertmanager.yml /etc/alertmanager/alertmanager.yml
COPY ./config/web_config.yml /etc/alertmanager/web_config.yml
COPY ./config/discord.tmpl /etc/alertmanager/discord.tmpl

RUN sed -i "s|DISCORD_WEBHOOK_URL|${DISCORD_WEBHOOK_URL}|g" /etc/alertmanager/alertmanager.yml

CMD [ "--config.file=/etc/alertmanager/alertmanager.yml", "--web.config.file=/etc/alertmanager/web_config.yml" ]