#!/bin/bash

CERT_DIR="/usr/share/elasticsearch/config/certs/prometheus"

mkdir -p $CERT_DIR
openssl genrsa -out $CERT_DIR/prometheus.key 2048
openssl req -new -key $CERT_DIR/prometheus.key -out $CERT_DIR/prometheus.csr -subj "/CN=prometheus"
openssl x509 -req -days 365 -in $CERT_DIR/prometheus.csr -signkey $CERT_DIR/prometheus.key -out $CERT_DIR/prometheus.crt
rm $CERT_DIR/prometheus.csr
echo "Prometheus SSL certificates generated successfully."