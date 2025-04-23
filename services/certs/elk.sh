#!/bin/bash

if [ x${ELASTIC_PASSWORD} == x ] || [ x${KIBANA_PASSWORD} == x ]; then
    echo "Set the ELASTIC_PASSWORD and KIBANA_PASSWORD environment variables in the .env file";
    exit 1;
fi;

if [ ! -f config/certs/ca.zip ]; then
    echo "Creating CA";
    bin/elasticsearch-certutil ca --silent --pem -out config/certs/ca.zip;
    unzip config/certs/ca.zip -d config/certs;
fi;

if [ ! -f config/certs/certs.zip ]; then
    echo "Creating certs";
    echo -ne \
    "instances:\n"\
    "  - name: elasticsearch\n"\
    "    dns:\n"\
    "      - elasticsearch\n"\
    "      - localhost\n"\
    "    ip:\n"\
    "      - 127.0.0.1\n"\
    "  - name: kibana\n"\
    "    dns:\n"\
    "      - kibana\n"\
    "      - localhost\n"\
    "    ip:\n"\
    "      - 127.0.0.1\n"\
    "  - name: logstash\n"\
    "    dns:\n"\
    "      - logstash\n"\
    "      - localhost\n"\
    "    ip:\n"\
    "      - 127.0.0.1\n"\
    "  - name: filebeat\n"\
    "    dns:\n"\
    "      - filebeat\n"\
    "      - localhost\n"\
    "    ip:\n"\
    "      - 127.0.0.1\n"\
    > config/certs/instances.yml;
    bin/elasticsearch-certutil cert --silent --pem -out config/certs/certs.zip --in config/certs/instances.yml --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key;
    unzip config/certs/certs.zip -d config/certs;
fi;

if [ ! -f config/certs/kibana-certs.zip ]; then
  echo -e "Creating CSR for Kibana";
  echo -ne \
  "instances:\n"\
  "  - name: kibana-server\n"\
  "    dns:\n"\
  "      - kibana-server\n"\
  "      - kibana\n"\
  "      - localhost\n"\
  "    ip:\n"\
  "      - 127.0.0.1\n"\
  > config/certs/instances_kibana.yml;
  bin/elasticsearch-certutil cert --silent --pem -out config/certs/kibana-certs.zip --in config/certs/instances_kibana.yml --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key;
  mkdir -p config/certs/kibana-server
  unzip config/certs/kibana-certs.zip -d config/certs/kibana-server/;
fi;

echo "Setting file permissions"
chown -R root:root config/certs;
find . -type d -exec chmod 750 \{\} \;;
find . -type f -exec chmod 640 \{\} \;;
echo "Waiting for Elasticsearch availability";
until curl -s --cacert config/certs/ca/ca.crt https://elasticsearch:9200 | grep -q "missing authentication credentials"; do sleep 15; done;
echo "Setting kibana_system password";
max_retries=5
count=0
while [ $count -lt $max_retries ]; do
    echo "Attempt $((count+1))/$max_retries: Setting kibana_system password..."
    
    response=$(curl -s -m 30 --write-out "\n%{http_code}" --cacert config/certs/ca/ca.crt \
        -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" \
        https://elasticsearch:9200/_security/user/kibana_system/_password \
        -d "{\"password\":\"${KIBANA_PASSWORD}\"}")
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo "Response code: $status_code"
    
    if [ "$status_code" = "200" ]; then
        echo "Password updated successfully"
        break
    else
        echo "Failed to set password: $body"
        count=$((count+1))
        sleep 5
    fi
done

if [ $count -eq $max_retries ]; then
    echo "Failed to set kibana_system password after $max_retries attempts"
    exit 1
fi
echo "All done!";