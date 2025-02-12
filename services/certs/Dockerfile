FROM docker.elastic.co/elasticsearch/elasticsearch:8.17.1

COPY ./elk.sh /usr/share/elasticsearch/elk.sh
COPY ./prometheus.sh /usr/share/elasticsearch/prometheus.sh
COPY ./grafana.sh /usr/share/elasticsearch/grafana.sh

USER '0'

RUN chmod +x /usr/share/elasticsearch/elk.sh
RUN chmod +x /usr/share/elasticsearch/prometheus.sh
RUN chmod +x /usr/share/elasticsearch/grafana.sh

RUN sh /usr/share/elasticsearch/prometheus.sh
RUN sh /usr/share/elasticsearch/grafana.sh

CMD ["/bin/bash", "/usr/share/elasticsearch/elk.sh"]