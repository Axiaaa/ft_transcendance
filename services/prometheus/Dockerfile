FROM prom/prometheus

COPY ./config/prometheus.yml /etc/prometheus/prometheus.yml
COPY ./config/web_config.yml /etc/prometheus/web_config.yml

USER '0'

CMD [ "--config.file=/etc/prometheus/prometheus.yml", "--web.config.file=/etc/prometheus/web_config.yml" ]
