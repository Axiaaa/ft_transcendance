FROM grafana/grafana

COPY ./config/grafana.ini /etc/grafana/grafana.ini
COPY ./config/datasources.yml /etc/grafana/provisioning/datasources/datasources.yml
COPY ./config/dashboards.yml /etc/grafana/provisioning/dashboards/dashboards.yml

COPY ./templates/* /etc/grafana/provisioning/dashboards/

