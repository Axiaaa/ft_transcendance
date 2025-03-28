#!/bin/bash

# Script to create data views for Kibana using Kibana API

CERT="/usr/share/kibana/config/certs/kibana/kibana.crt"
KEY="/usr/share/kibana/config/certs/kibana/kibana.key" 
CA="usr/share/kibana/config/certs/ca/ca.crt"

KIBANA_URL="https://kibana:5601" # Change to your Kibana URL
SPACE_ID="default" # Change if using a specific space

if [ x${ELASTIC_PASSWORD} == x ] || [ x${KIBANA_PASSWORD} == x ]; then
    echo "Set the ELASTIC_PASSWORD and KIBANA_PASSWORD environment variables in the .env file";
    exit 1;
fi;

filebeat_data_view='{
  "data_view": {
    "title": "filebeat-*",
    "name": "My Filebeat Data View",
    "id": "filebeat-data",
    "fieldAttrs": {
      "timestamp": {
        "customLabel": "Timestamp"
      },
      "program": {
        "customLabel": "Program"
      },
      "syslog_message": {
        "customLabel": "Message"
      }
    }
  }
}'

logstash_data_view='{
  "data_view": {
    "title": "logstash-*",
    "name": "My Logstash Data View",
    "id": "logstash-data",
    "fieldAttrs": {
      "@timestamp": {
        "customLabel": "Timestamp"
      },
      "message": {
        "customLabel": "Message"
      }
    }
  }
}'

elasticsearch_data_view='{
  "data_view": {
    "title": "elasticsearch-*",
    "name": "My Elasticsearch Data View",
    "id": "elasticsearch-data",
    "fieldAttrs": {
      "@timestamp": {
        "customLabel": "Timestamp"
      },
      "message": {
        "customLabel": "Message"
      }
    }
  }
}'

request=$(curl -X POST "$KIBANA_URL/api/data_views/_create" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  --cert "$CERT" --key "$KEY" --cacert "$CA" \
  -d "$filebeat_data_view")
if [ $? -ne 0 ]; then
    echo "Failed to create filebeat data view"
    exit 1
fi
echo "Filebeat data view created successfully"
