#!/bin/bash

# Script to create ILM policy for Elasticsearch using Elasticsearch API
CERT="/usr/share/elasticsearch/config/certs/elasticsearch/elasticsearch.crt"
KEY="/usr/share/elasticsearch/config/certs/elasticsearch/elasticsearch.key"
CA="/usr/share/elasticsearch/config/certs/ca/ca.crt"
ELASTICSEARCH_URL="https://elasticsearch:9200"

ilm='{"policy":{
    "phases":{
        "warm":{"min_age":"15d","actions":{"set_priority":{"priority":50}}},
        "cold":{"min_age":"30d","actions":{"set_priority":{"priority":0}}},
        "hot":{"min_age":"0ms","actions":{"set_priority":{"priority":100},
        "rollover":{"max_age":"30d","max_primary_shard_size":"50gb"}}},
        "delete":{"min_age":"182d","actions":{"delete":{"delete_searchable_snapshot":true}}}}}}
}'

echo "Creating ILM policy..."

request=$(curl -X PUT "$ELASTICSEARCH_URL/_ilm/policy/Default" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  --cert "$CERT" --key "$KEY" --cacert "$CA" \
  -d "$ilm")


if [[ "$request" == *'{"acknowledged":true}'* ]]; then
    echo "ILM policy created successfully"
else
    echo "Failed to create ILM policy"
    echo $request
fi

# Request to get the ILM policy
# curl -k -X GET "https://localhost:9200/_ilm/policy/Default" -H 'kbn-xsrf: true' \
#      -u "elastic:changeme"
