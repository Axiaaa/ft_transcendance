#!/bin/bash

CERT_DIR="/usr/share/elasticsearch/config/certs/nginx"
CA_DIR="/usr/share/elasticsearch/config/certs/ca_nginx"

# Create directories
mkdir -p $CERT_DIR
mkdir -p $CA_DIR

openssl genrsa -out $CA_DIR/ca.key 2048
openssl req -x509 -new -nodes -key $CA_DIR/ca.key -sha256 -days 365 -out $CA_DIR/ca.crt -subj "/C=FR/ST=Paris/L=Paris/O=42/OU=CA/CN=localhost"

openssl genrsa -out $CERT_DIR/nginx.key 2048
openssl req -new -key $CERT_DIR/nginx.key -out $CERT_DIR/nginx.csr -subj "/C=FR/ST=Paris/L=Paris/O=42/OU=localhost/CN=localhost"

openssl x509 -req -in $CERT_DIR/nginx.csr -CA $CA_DIR/ca.crt -CAkey $CA_DIR/ca.key -CAcreateserial -out $CERT_DIR/nginx.crt -days 365 -sha256

# Clean up
rm $CERT_DIR/nginx.csr
echo "nginx SSL certificates generated successfully."