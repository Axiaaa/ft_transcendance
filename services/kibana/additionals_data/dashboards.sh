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

filebeat_dashboard='{
  "version": "8.17.1",
  "objects": [
    {
      "id": "d4615129-8b1e-4b7d-a041-e8e4350debea",
      "type": "dashboard",
      "namespaces": [
        "default"
      ],
      "updated_at": "2025-03-31T10:22:36.311Z",
      "created_at": "2025-03-31T09:53:41.998Z",
      "updated_by": "u_mGBROF_q5bmFCATbLXAcCwKa0k8JvONAwSruelyKA5E_0",
      "version": "WzEyNCwxXQ==",
      "attributes": {
        "version": 3,
        "description": "",
        "timeRestore": false,
        "title": "[Filebeat] Log sanity ",
        "controlGroupInput": {
          "chainingSystem": "HIERARCHICAL",
          "controlStyle": "oneLine",
          "ignoreParentSettingsJSON": "{\"ignoreFilters\":false,\"ignoreQuery\":false,\"ignoreTimerange\":false,\"ignoreValidations\":false}",
          "panelsJSON": "{}",
          "showApplySelections": false
        },
        "optionsJSON": "{\"useMargins\":true,\"syncColors\":false,\"syncCursor\":true,\"syncTooltips\":false,\"hidePanelTitles\":false}",
        "panelsJSON": "[{\"type\":\"lens\",\"title\":\"Log sanity\",\"embeddableConfig\":{\"attributes\":{\"title\":\"\",\"visualizationType\":\"lnsXY\",\"type\":\"lens\",\"references\":[{\"type\":\"index-pattern\",\"id\":\"filebeat-data\",\"name\":\"indexpattern-datasource-layer-aa55060d-8719-4754-a6a8-f063ee95f32c\"}],\"state\":{\"visualization\":{\"legend\":{\"isVisible\":true,\"position\":\"right\"},\"valueLabels\":\"hide\",\"fittingFunction\":\"Linear\",\"axisTitlesVisibilitySettings\":{\"x\":true,\"yLeft\":true,\"yRight\":true},\"tickLabelsVisibilitySettings\":{\"x\":true,\"yLeft\":true,\"yRight\":true},\"labelsOrientation\":{\"x\":0,\"yLeft\":0,\"yRight\":0},\"gridlinesVisibilitySettings\":{\"x\":true,\"yLeft\":true,\"yRight\":true},\"preferredSeriesType\":\"bar_stacked\",\"layers\":[{\"layerId\":\"aa55060d-8719-4754-a6a8-f063ee95f32c\",\"accessors\":[\"81931c82-3e86-4c36-8655-01a40021cfd0\"],\"position\":\"top\",\"seriesType\":\"bar_stacked\",\"showGridlines\":false,\"layerType\":\"data\",\"colorMapping\":{\"assignments\":[],\"specialAssignments\":[{\"rule\":{\"type\":\"other\"},\"color\":{\"type\":\"loop\"},\"touched\":false}],\"paletteId\":\"eui_amsterdam_color_blind\",\"colorMode\":{\"type\":\"categorical\"}},\"xAccessor\":\"e9f9141a-6062-4d7a-8ea1-2f8dfec6321e\",\"yConfig\":[{\"forAccessor\":\"81931c82-3e86-4c36-8655-01a40021cfd0\",\"color\":\"#b37f54\"}]}]},\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filters\":[],\"datasourceStates\":{\"formBased\":{\"layers\":{\"aa55060d-8719-4754-a6a8-f063ee95f32c\":{\"columns\":{\"e9f9141a-6062-4d7a-8ea1-2f8dfec6321e\":{\"label\":\"Top 5 values of log.level.keyword\",\"dataType\":\"string\",\"operationType\":\"terms\",\"scale\":\"ordinal\",\"sourceField\":\"log.level.keyword\",\"isBucketed\":true,\"params\":{\"size\":5,\"orderBy\":{\"type\":\"column\",\"columnId\":\"81931c82-3e86-4c36-8655-01a40021cfd0\"},\"orderDirection\":\"desc\",\"otherBucket\":true,\"missingBucket\":false,\"parentFormat\":{\"id\":\"terms\"},\"include\":[],\"exclude\":[],\"includeIsRegex\":false,\"excludeIsRegex\":false}},\"81931c82-3e86-4c36-8655-01a40021cfd0\":{\"label\":\"Count of records\",\"dataType\":\"number\",\"operationType\":\"count\",\"isBucketed\":false,\"scale\":\"ratio\",\"sourceField\":\"___records___\",\"params\":{\"emptyAsNull\":true}}},\"columnOrder\":[\"e9f9141a-6062-4d7a-8ea1-2f8dfec6321e\",\"81931c82-3e86-4c36-8655-01a40021cfd0\"],\"incompleteColumns\":{},\"sampling\":1}}},\"indexpattern\":{\"layers\":{}},\"textBased\":{\"layers\":{}}},\"internalReferences\":[],\"adHocDataViews\":{}}},\"enhancements\":{}},\"panelIndex\":\"3446d547-faa9-419a-bb19-daf33cac4bf0\",\"gridData\":{\"x\":0,\"y\":0,\"w\":18,\"h\":14,\"i\":\"3446d547-faa9-419a-bb19-daf33cac4bf0\"}},{\"type\":\"lens\",\"embeddableConfig\":{\"attributes\":{\"title\":\"\",\"visualizationType\":\"lnsLegacyMetric\",\"type\":\"lens\",\"references\":[{\"type\":\"index-pattern\",\"id\":\"filebeat-data\",\"name\":\"indexpattern-datasource-layer-ee2ba561-4ea0-4264-a983-dfcdea072c01\"}],\"state\":{\"visualization\":{\"layerId\":\"ee2ba561-4ea0-4264-a983-dfcdea072c01\",\"accessor\":\"e6b34a83-db36-4bc4-b007-fc79d3372ee3\",\"layerType\":\"data\",\"colorMode\":\"Labels\",\"palette\":{\"name\":\"custom\",\"type\":\"palette\",\"params\":{\"steps\":3,\"name\":\"custom\",\"reverse\":false,\"rangeType\":\"number\",\"rangeMin\":0,\"rangeMax\":null,\"progression\":\"fixed\",\"stops\":[{\"color\":\"#cc5642\",\"stop\":1},{\"color\":\"#209280\",\"stop\":2}],\"colorStops\":[{\"color\":\"#cc5642\",\"stop\":0},{\"color\":\"#209280\",\"stop\":1}],\"continuity\":\"above\",\"maxSteps\":5}}},\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filters\":[],\"datasourceStates\":{\"formBased\":{\"layers\":{\"ee2ba561-4ea0-4264-a983-dfcdea072c01\":{\"columns\":{\"e6b34a83-db36-4bc4-b007-fc79d3372ee3X0\":{\"label\":\"Part of Is the host dockerised ?\",\"dataType\":\"number\",\"operationType\":\"unique_count\",\"scale\":\"ratio\",\"sourceField\":\"system_info.host.containerized\",\"isBucketed\":false,\"params\":{\"emptyAsNull\":false},\"customLabel\":true},\"e6b34a83-db36-4bc4-b007-fc79d3372ee3\":{\"label\":\"Is the host dockerised ?\",\"dataType\":\"number\",\"operationType\":\"formula\",\"isBucketed\":false,\"scale\":\"ratio\",\"params\":{\"formula\":\"unique_count(system_info.host.containerized)\",\"isFormulaBroken\":false},\"references\":[\"e6b34a83-db36-4bc4-b007-fc79d3372ee3X0\"],\"customLabel\":true}},\"columnOrder\":[\"e6b34a83-db36-4bc4-b007-fc79d3372ee3\",\"e6b34a83-db36-4bc4-b007-fc79d3372ee3X0\"],\"incompleteColumns\":{}}}},\"indexpattern\":{\"layers\":{}},\"textBased\":{\"layers\":{}}},\"internalReferences\":[],\"adHocDataViews\":{}}},\"enhancements\":{}},\"panelIndex\":\"3ca5e632-101f-411a-910e-4fefe6e3eff7\",\"gridData\":{\"x\":18,\"y\":0,\"w\":11,\"h\":7,\"i\":\"3ca5e632-101f-411a-910e-4fefe6e3eff7\"}},{\"type\":\"lens\",\"title\":\"% of http methods used\",\"embeddableConfig\":{\"attributes\":{\"title\":\"\",\"visualizationType\":\"lnsPie\",\"type\":\"lens\",\"references\":[{\"type\":\"index-pattern\",\"id\":\"fastify-data\",\"name\":\"indexpattern-datasource-layer-48909ea5-1263-4055-a3f1-ae184bb710ce\"}],\"state\":{\"visualization\":{\"shape\":\"pie\",\"layers\":[{\"layerId\":\"48909ea5-1263-4055-a3f1-ae184bb710ce\",\"primaryGroups\":[\"9f395fba-6b63-43b0-a4e3-2c4f0e4bc428\"],\"metrics\":[\"2cd05e9f-7ebc-42ef-bd86-41956a9a09f4\"],\"numberDisplay\":\"percent\",\"categoryDisplay\":\"default\",\"legendDisplay\":\"default\",\"nestedLegend\":false,\"layerType\":\"data\",\"colorMapping\":{\"assignments\":[],\"specialAssignments\":[{\"rule\":{\"type\":\"other\"},\"color\":{\"type\":\"loop\"},\"touched\":false}],\"paletteId\":\"eui_amsterdam_color_blind\",\"colorMode\":{\"type\":\"categorical\"}}}]},\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filters\":[],\"datasourceStates\":{\"formBased\":{\"layers\":{\"48909ea5-1263-4055-a3f1-ae184bb710ce\":{\"columns\":{\"9f395fba-6b63-43b0-a4e3-2c4f0e4bc428\":{\"label\":\"Top 5 values of req.method.keyword\",\"dataType\":\"string\",\"operationType\":\"terms\",\"scale\":\"ordinal\",\"sourceField\":\"req.method.keyword\",\"isBucketed\":true,\"params\":{\"size\":5,\"orderBy\":{\"type\":\"column\",\"columnId\":\"2cd05e9f-7ebc-42ef-bd86-41956a9a09f4\"},\"orderDirection\":\"desc\",\"otherBucket\":true,\"missingBucket\":false,\"parentFormat\":{\"id\":\"terms\"},\"include\":[],\"exclude\":[],\"includeIsRegex\":false,\"excludeIsRegex\":false}},\"2cd05e9f-7ebc-42ef-bd86-41956a9a09f4\":{\"label\":\"Count of records\",\"dataType\":\"number\",\"operationType\":\"count\",\"isBucketed\":false,\"scale\":\"ratio\",\"sourceField\":\"___records___\",\"params\":{\"emptyAsNull\":true}}},\"columnOrder\":[\"9f395fba-6b63-43b0-a4e3-2c4f0e4bc428\",\"2cd05e9f-7ebc-42ef-bd86-41956a9a09f4\"],\"incompleteColumns\":{},\"sampling\":1}}},\"indexpattern\":{\"layers\":{}},\"textBased\":{\"layers\":{}}},\"internalReferences\":[],\"adHocDataViews\":{}}},\"enhancements\":{}},\"panelIndex\":\"cd5ea292-a1b8-4f5f-954e-bfcdee237a89\",\"gridData\":{\"x\":29,\"y\":0,\"w\":19,\"h\":25,\"i\":\"cd5ea292-a1b8-4f5f-954e-bfcdee237a89\"}},{\"type\":\"lens\",\"title\":\"Median response time of Node.js server\",\"embeddableConfig\":{\"attributes\":{\"title\":\"\",\"visualizationType\":\"lnsMetric\",\"type\":\"lens\",\"references\":[{\"type\":\"index-pattern\",\"id\":\"fastify-data\",\"name\":\"indexpattern-datasource-layer-789867ea-4f51-4df7-8f36-bd3610c5367c\"},{\"type\":\"index-pattern\",\"name\":\"3faefd16-15f9-466d-a903-75bb140fd63f\",\"id\":\"fastify-data\"}],\"state\":{\"visualization\":{\"layerId\":\"789867ea-4f51-4df7-8f36-bd3610c5367c\",\"layerType\":\"data\",\"metricAccessor\":\"e83e9b61-fb10-4cef-8fd0-7651ef89a096\"},\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filters\":[{\"meta\":{\"index\":\"3faefd16-15f9-466d-a903-75bb140fd63f\",\"type\":\"exists\",\"key\":\"responseTime\",\"value\":\"exists\",\"disabled\":false,\"negate\":false,\"alias\":null},\"query\":{\"exists\":{\"field\":\"responseTime\"}},\"$state\":{\"store\":\"appState\"}}],\"datasourceStates\":{\"formBased\":{\"layers\":{\"789867ea-4f51-4df7-8f36-bd3610c5367c\":{\"columns\":{\"e83e9b61-fb10-4cef-8fd0-7651ef89a096\":{\"label\":\"Median of responseTime\",\"dataType\":\"number\",\"operationType\":\"median\",\"sourceField\":\"responseTime\",\"isBucketed\":false,\"scale\":\"ratio\",\"params\":{\"emptyAsNull\":true}}},\"columnOrder\":[\"e83e9b61-fb10-4cef-8fd0-7651ef89a096\"],\"incompleteColumns\":{}}}},\"indexpattern\":{\"layers\":{}},\"textBased\":{\"layers\":{}}},\"internalReferences\":[],\"adHocDataViews\":{}}},\"enhancements\":{}},\"panelIndex\":\"2f70f47d-4675-476a-b8f9-2294ba98a4f3\",\"gridData\":{\"x\":18,\"y\":7,\"w\":11,\"h\":7,\"i\":\"2f70f47d-4675-476a-b8f9-2294ba98a4f3\"}}]",
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
        }
      },
      "references": [
        {
          "type": "index-pattern",
          "id": "filebeat-data",
          "name": "3446d547-faa9-419a-bb19-daf33cac4bf0:indexpattern-datasource-layer-aa55060d-8719-4754-a6a8-f063ee95f32c"
        },
        {
          "type": "index-pattern",
          "id": "filebeat-data",
          "name": "3ca5e632-101f-411a-910e-4fefe6e3eff7:indexpattern-datasource-layer-ee2ba561-4ea0-4264-a983-dfcdea072c01"
        },
        {
          "type": "index-pattern",
          "id": "fastify-data",
          "name": "cd5ea292-a1b8-4f5f-954e-bfcdee237a89:indexpattern-datasource-layer-48909ea5-1263-4055-a3f1-ae184bb710ce"
        },
        {
          "type": "index-pattern",
          "id": "fastify-data",
          "name": "2f70f47d-4675-476a-b8f9-2294ba98a4f3:indexpattern-datasource-layer-789867ea-4f51-4df7-8f36-bd3610c5367c"
        },
        {
          "type": "index-pattern",
          "name": "2f70f47d-4675-476a-b8f9-2294ba98a4f3:3faefd16-15f9-466d-a903-75bb140fd63f",
          "id": "fastify-data"
        }
      ],
      "managed": false,
      "coreMigrationVersion": "8.8.0",
      "typeMigrationVersion": "10.2.0"
    },
    {
      "id": "filebeat-data",
      "type": "index-pattern",
      "namespaces": [
        "default"
      ],
      "updated_at": "2025-03-31T09:53:37.829Z",
      "created_at": "2025-03-31T09:53:37.829Z",
      "version": "WzUsMV0=",
      "attributes": {
        "fieldAttrs": "{\"timestamp\":{\"customLabel\":\"Timestamp\"},\"program\":{\"customLabel\":\"Program\"},\"syslog_message\":{\"customLabel\":\"Message\"}}",
        "title": "filebeat-*",
        "sourceFilters": "[]",
        "fields": "[]",
        "fieldFormatMap": "{}",
        "runtimeFieldMap": "{}",
        "name": "Filebeat Data View",
        "allowHidden": false
      },
      "references": [],
      "managed": false,
      "coreMigrationVersion": "8.8.0",
      "typeMigrationVersion": "8.0.0"
    },
    {
      "id": "fastify-data",
      "type": "index-pattern",
      "namespaces": [
        "default"
      ],
      "updated_at": "2025-03-31T09:53:40.016Z",
      "created_at": "2025-03-31T09:53:40.016Z",
      "version": "WzgsMV0=",
      "attributes": {
        "fieldAttrs": "{\"@timestamp\":{\"customLabel\":\"Timestamp\"},\"message\":{\"customLabel\":\"Message\"}}",
        "title": "fastifyapp-*",
        "sourceFilters": "[]",
        "fields": "[]",
        "fieldFormatMap": "{}",
        "runtimeFieldMap": "{}",
        "name": "My Fastify Data View",
        "allowHidden": false
      },
      "references": [],
      "managed": false,
      "coreMigrationVersion": "8.8.0",
      "typeMigrationVersion": "8.0.0"
    }
  ]
}'

request=$(curl -X POST "$KIBANA_URL/api/kibana/dashboards/import?exclude=index-pattern" \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  --cert "$CERT" --key "$KEY" --cacert "$CA" \
  -d "$filebeat_dashboard")
if [[ "$request" == *'{"objects":[{"type":"dashboard"'* ]]; then
    echo "Dashboard created successfully"
else 
    echo "Failed to create dashboard"
    echo $request
fi

# To export a dashboard, you can curl the object and put the id of the dashboard
# curl -k -X GET "https://localhost:5601/api/kibana/dashboards/export?dashboard=" -H 'k
# bn-xsrf: true' \
# -u "elastic:changeme"


