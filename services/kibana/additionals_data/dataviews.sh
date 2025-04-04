#!/bin/bash

# Script to create data views for Kibana using Kibana API

CERT="/usr/share/kibana/config/certs/kibana-server/kibana-server/kibana-server.crt"
KEY="/usr/share/kibana/config/certs/kibana-server/kibana-server/kibana-server.key"
CA="/usr/share/kibana/config/certs/ca/ca.crt"
KIBANA_URL="https://kibana:5601"

if [ x${ELASTIC_PASSWORD} == x ] || [ x${KIBANA_PASSWORD} == x ]; then
    echo "Set the ELASTIC_PASSWORD and KIBANA_PASSWORD environment variables in the .env file";
    exit 1;
fi;

filebeat_data_view='{
  "data_view": {
    "title": "filebeat-*",
    "name": "Filebeat Data View",
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

fastifyapp_data_view='{
  "data_view": {
    "title": "fastifyapp-*",
    "name": "My Fastify Data View",
    "id": "fastify-data",
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

nginx_data_view='{
  "data_view": {
    "title": "nginx-*",
    "name": "My Nginx Data View",
    "id": "nginx-data",
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



request=$(curl -X POST "$KIBANA_URL/api/data_views/data_view" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  --cert "$CERT" --key "$KEY" --cacert "$CA" \
  -d "$filebeat_data_view")
if [[ "$request" == *'{"data_view":{"id":"filebeat-data"'* ]]; then
    echo "Filebeat data view created successfully"
else 
    echo "Failed to create filebeat data view"
    echo $request
fi



request=$(curl -X POST "$KIBANA_URL/api/data_views/data_view" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  --cert "$CERT" --key "$KEY" --cacert "$CA" \
  -d "$logstash_data_view")
if [[ "$request" == *'{"data_view":{"id":"logstash-data"'* ]]; then
    echo "Logstash data view created successfully"
else 
    echo "Failed to create logstash data view"
    echo $request
fi


request=$(curl -X POST "$KIBANA_URL/api/data_views/data_view" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  --cert "$CERT" --key "$KEY" --cacert "$CA" \
  -d "$elasticsearch_data_view")
if [[ "$request" == *'{"data_view":{"id":"elasticsearch-data"'* ]]; then
    echo "Filebeat data view created successfully"
else 
    echo "Failed to create elasticsearchdata view"
    echo $request
fi

request=$(curl -X POST "$KIBANA_URL/api/data_views/data_view" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  --cert "$CERT" --key "$KEY" --cacert "$CA" \
  -d "$fastifyapp_data_view")
if [[ "$request" == *'{"data_view":{"id":"fastify-data"'* ]]; then
    echo "Fastify data view created successfully"
else
    echo "Failed to create fastify data view"
    echo $request
fi

request=$(curl -X POST "$KIBANA_URL/api/data_views/data_view" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  --cert "$CERT" --key "$KEY" --cacert "$CA" \
  -d "$nginx_data_view")
if [[ "$request" == *'{"data_view":{"id":"nginx-data"'* ]]; then
    echo "Nginx data view created successfully"
else
    echo "Failed to create nginx data view"
    echo $request
fi  

echo "Data views created successfully"

