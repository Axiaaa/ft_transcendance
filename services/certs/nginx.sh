#!/bin/bash

CERT_DIR="/usr/share/elasticsearch/config/certs/nginx"

mkdir -p $CERT_DIR
openssl genrsa -out $CERT_DIR/nginx.key 2048
openssl req -new -key $CERT_DIR/nginx.key -out $CERT_DIR/nginx.csr -subj "/C=FR/ST=Paris/L=Paris/O=42/OU=localhost/CN=localhost"
openssl x509 -req -days 365 -in $CERT_DIR/nginx.csr -signkey $CERT_DIR/nginx.key -out $CERT_DIR/nginx.crt
rm $CERT_DIR/nginx.csr
echo "nginx SSL certificates generated successfully."