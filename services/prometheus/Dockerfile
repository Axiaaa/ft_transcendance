FROM prom/prometheus

USER '0'

COPY ./config/prometheus.yml /etc/prometheus/prometheus.yml
COPY ./config/web_config.yml /etc/prometheus/web_config.yml
COPY ./config/alert_rules.yml /etc/prometheus/alert_rules.yml

CMD [ "--config.file=/etc/prometheus/prometheus.yml", "--web.config.file=/etc/prometheus/web_config.yml", "--storage.tsdb.retention.time=30d", "--storage.tsdb.retention.size=10GB"] 
