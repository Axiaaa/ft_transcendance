#!/bin/bash

CERT_DIR="/usr/share/elasticsearch/config/certs/grafana"

mkdir -p $CERT_DIR
openssl genrsa -out $CERT_DIR/grafana.key 2048
openssl req -new -key $CERT_DIR/grafana.key -out $CERT_DIR/grafana.csr -subj "/CN=grafana"
openssl x509 -req -days 365 -in $CERT_DIR/grafana.csr -signkey $CERT_DIR/grafana.key -out $CERT_DIR/grafana.crt
rm $CERT_DIR/grafana.csr
echo "Grafana SSL certificates generated successfully."