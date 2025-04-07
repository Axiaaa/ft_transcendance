FROM gcr.io/cadvisor/cadvisor:latest


# No HTTPS support in cAdvisor. The certs are for Prometheus HTTPS handling.
CMD [ "/usr/bin/cadvisor", "--logtostderr", "--tls_cert_file=/etc/certs/prometheus/prometheus.crt", "--tls_key_file/etc/certs/prometheus/prometheus.key" ]