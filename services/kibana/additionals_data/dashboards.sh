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
      "updated_at": "2025-04-25T06:08:20.441Z",
      "created_at": "2025-04-25T05:53:50.594Z",
      "updated_by": "u_mGBROF_q5bmFCATbLXAcCwKa0k8JvONAwSruelyKA5E_0",
      "version": "WzMyLDFd",
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
        "panelsJSON": "[{\"type\":\"lens\",\"title\":\"Log sanity\",\"embeddableConfig\":{\"attributes\":{\"title\":\"\",\"visualizationType\":\"lnsXY\",\"type\":\"lens\",\"references\":[{\"type\":\"index-pattern\",\"id\":\"filebeat-data\",\"name\":\"indexpattern-datasource-layer-aa55060d-8719-4754-a6a8-f063ee95f32c\"}],\"state\":{\"visualization\":{\"legend\":{\"isVisible\":true,\"position\":\"right\"},\"valueLabels\":\"hide\",\"fittingFunction\":\"Linear\",\"axisTitlesVisibilitySettings\":{\"x\":true,\"yLeft\":true,\"yRight\":true},\"tickLabelsVisibilitySettings\":{\"x\":true,\"yLeft\":true,\"yRight\":true},\"labelsOrientation\":{\"x\":0,\"yLeft\":0,\"yRight\":0},\"gridlinesVisibilitySettings\":{\"x\":true,\"yLeft\":true,\"yRight\":true},\"preferredSeriesType\":\"bar_stacked\",\"layers\":[{\"layerId\":\"aa55060d-8719-4754-a6a8-f063ee95f32c\",\"accessors\":[\"81931c82-3e86-4c36-8655-01a40021cfd0\"],\"position\":\"top\",\"seriesType\":\"bar_stacked\",\"showGridlines\":false,\"layerType\":\"data\",\"colorMapping\":{\"assignments\":[],\"specialAssignments\":[{\"rule\":{\"type\":\"other\"},\"color\":{\"type\":\"loop\"},\"touched\":false}],\"paletteId\":\"eui_amsterdam_color_blind\",\"colorMode\":{\"type\":\"categorical\"}},\"xAccessor\":\"e9f9141a-6062-4d7a-8ea1-2f8dfec6321e\",\"yConfig\":[{\"forAccessor\":\"81931c82-3e86-4c36-8655-01a40021cfd0\",\"color\":\"#b37f54\"}]}]},\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filters\":[],\"datasourceStates\":{\"formBased\":{\"layers\":{\"aa55060d-8719-4754-a6a8-f063ee95f32c\":{\"columns\":{\"e9f9141a-6062-4d7a-8ea1-2f8dfec6321e\":{\"label\":\"Top 5 values of log.level.keyword\",\"dataType\":\"string\",\"operationType\":\"terms\",\"scale\":\"ordinal\",\"sourceField\":\"log.level.keyword\",\"isBucketed\":true,\"params\":{\"size\":5,\"orderBy\":{\"type\":\"column\",\"columnId\":\"81931c82-3e86-4c36-8655-01a40021cfd0\"},\"orderDirection\":\"desc\",\"otherBucket\":true,\"missingBucket\":false,\"parentFormat\":{\"id\":\"terms\"},\"include\":[],\"exclude\":[],\"includeIsRegex\":false,\"excludeIsRegex\":false}},\"81931c82-3e86-4c36-8655-01a40021cfd0\":{\"label\":\"Count of records\",\"dataType\":\"number\",\"operationType\":\"count\",\"isBucketed\":false,\"scale\":\"ratio\",\"sourceField\":\"___records___\",\"params\":{\"emptyAsNull\":true}}},\"columnOrder\":[\"e9f9141a-6062-4d7a-8ea1-2f8dfec6321e\",\"81931c82-3e86-4c36-8655-01a40021cfd0\"],\"incompleteColumns\":{},\"sampling\":1}}},\"indexpattern\":{\"layers\":{}},\"textBased\":{\"layers\":{}}},\"internalReferences\":[],\"adHocDataViews\":{}}},\"enhancements\":{}},\"panelIndex\":\"3446d547-faa9-419a-bb19-daf33cac4bf0\",\"gridData\":{\"x\":0,\"y\":0,\"w\":18,\"h\":14,\"i\":\"3446d547-faa9-419a-bb19-daf33cac4bf0\"}},{\"type\":\"lens\",\"embeddableConfig\":{\"attributes\":{\"title\":\"\",\"visualizationType\":\"lnsLegacyMetric\",\"type\":\"lens\",\"references\":[{\"type\":\"index-pattern\",\"id\":\"filebeat-data\",\"name\":\"indexpattern-datasource-layer-ee2ba561-4ea0-4264-a983-dfcdea072c01\"}],\"state\":{\"visualization\":{\"layerId\":\"ee2ba561-4ea0-4264-a983-dfcdea072c01\",\"accessor\":\"e6b34a83-db36-4bc4-b007-fc79d3372ee3\",\"layerType\":\"data\",\"colorMode\":\"Labels\",\"palette\":{\"name\":\"custom\",\"type\":\"palette\",\"params\":{\"steps\":3,\"name\":\"custom\",\"reverse\":false,\"rangeType\":\"number\",\"rangeMin\":0,\"rangeMax\":null,\"progression\":\"fixed\",\"stops\":[{\"color\":\"#cc5642\",\"stop\":1},{\"color\":\"#209280\",\"stop\":2}],\"colorStops\":[{\"color\":\"#cc5642\",\"stop\":0},{\"color\":\"#209280\",\"stop\":1}],\"continuity\":\"above\",\"maxSteps\":5}}},\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filters\":[],\"datasourceStates\":{\"formBased\":{\"layers\":{\"ee2ba561-4ea0-4264-a983-dfcdea072c01\":{\"columns\":{\"e6b34a83-db36-4bc4-b007-fc79d3372ee3X0\":{\"label\":\"Part of Is the host dockerised ?\",\"dataType\":\"number\",\"operationType\":\"unique_count\",\"scale\":\"ratio\",\"sourceField\":\"system_info.host.containerized\",\"isBucketed\":false,\"params\":{\"emptyAsNull\":false},\"customLabel\":true},\"e6b34a83-db36-4bc4-b007-fc79d3372ee3\":{\"label\":\"Is the host dockerised ?\",\"dataType\":\"number\",\"operationType\":\"formula\",\"isBucketed\":false,\"scale\":\"ratio\",\"params\":{\"formula\":\"unique_count(system_info.host.containerized)\",\"isFormulaBroken\":false},\"references\":[\"e6b34a83-db36-4bc4-b007-fc79d3372ee3X0\"],\"customLabel\":true}},\"columnOrder\":[\"e6b34a83-db36-4bc4-b007-fc79d3372ee3\",\"e6b34a83-db36-4bc4-b007-fc79d3372ee3X0\"],\"incompleteColumns\":{}}}},\"indexpattern\":{\"layers\":{}},\"textBased\":{\"layers\":{}}},\"internalReferences\":[],\"adHocDataViews\":{}}},\"enhancements\":{}},\"panelIndex\":\"3ca5e632-101f-411a-910e-4fefe6e3eff7\",\"gridData\":{\"x\":18,\"y\":0,\"w\":11,\"h\":7,\"i\":\"3ca5e632-101f-411a-910e-4fefe6e3eff7\"}},{\"type\":\"lens\",\"title\":\"Methods of User Route\",\"embeddableConfig\":{\"attributes\":{\"title\":\"\",\"visualizationType\":\"lnsPie\",\"type\":\"lens\",\"references\":[{\"type\":\"index-pattern\",\"id\":\"user-route-data\",\"name\":\"indexpattern-datasource-layer-aedf86a7-8b5e-47a1-94e0-2aaeeb56a443\"}],\"state\":{\"visualization\":{\"shape\":\"donut\",\"layers\":[{\"layerId\":\"aedf86a7-8b5e-47a1-94e0-2aaeeb56a443\",\"primaryGroups\":[\"e35a6355-2fa6-4e3c-9a51-bddf655e2270\"],\"metrics\":[\"c8e762a9-7cfa-404a-b431-6e2883d0db15\"],\"numberDisplay\":\"percent\",\"categoryDisplay\":\"default\",\"legendDisplay\":\"default\",\"nestedLegend\":false,\"layerType\":\"data\",\"colorMapping\":{\"assignments\":[],\"specialAssignments\":[{\"rule\":{\"type\":\"other\"},\"color\":{\"type\":\"loop\"},\"touched\":false}],\"paletteId\":\"eui_amsterdam_color_blind\",\"colorMode\":{\"type\":\"categorical\"}}}]},\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filters\":[],\"datasourceStates\":{\"formBased\":{\"layers\":{\"aedf86a7-8b5e-47a1-94e0-2aaeeb56a443\":{\"columns\":{\"c8e762a9-7cfa-404a-b431-6e2883d0db15\":{\"label\":\"Count of records\",\"dataType\":\"number\",\"operationType\":\"count\",\"isBucketed\":false,\"scale\":\"ratio\",\"sourceField\":\"___records___\",\"params\":{\"emptyAsNull\":true}},\"e35a6355-2fa6-4e3c-9a51-bddf655e2270\":{\"label\":\"Top 5 values of req.method.keyword\",\"dataType\":\"string\",\"operationType\":\"terms\",\"scale\":\"ordinal\",\"sourceField\":\"req.method.keyword\",\"isBucketed\":true,\"params\":{\"size\":5,\"orderBy\":{\"type\":\"column\",\"columnId\":\"c8e762a9-7cfa-404a-b431-6e2883d0db15\"},\"orderDirection\":\"desc\",\"otherBucket\":true,\"missingBucket\":false,\"parentFormat\":{\"id\":\"terms\"},\"include\":[],\"exclude\":[],\"includeIsRegex\":false,\"excludeIsRegex\":false}}},\"columnOrder\":[\"e35a6355-2fa6-4e3c-9a51-bddf655e2270\",\"c8e762a9-7cfa-404a-b431-6e2883d0db15\"],\"incompleteColumns\":{},\"sampling\":1,\"indexPatternId\":\"user-route-data\"}},\"currentIndexPatternId\":\"user-route-data\"},\"indexpattern\":{\"layers\":{}},\"textBased\":{\"layers\":{}}},\"internalReferences\":[],\"adHocDataViews\":{}}},\"enhancements\":{}},\"panelIndex\":\"fc2e7853-9067-40e9-8f81-45ec869b3cd4\",\"gridData\":{\"x\":29,\"y\":0,\"w\":19,\"h\":15,\"i\":\"fc2e7853-9067-40e9-8f81-45ec869b3cd4\"}},{\"type\":\"lens\",\"title\":\"Median Response Time of User Route Request\",\"embeddableConfig\":{\"attributes\":{\"title\":\"\",\"visualizationType\":\"lnsMetric\",\"type\":\"lens\",\"references\":[{\"type\":\"index-pattern\",\"id\":\"user-route-data\",\"name\":\"indexpattern-datasource-layer-e7b2f1ec-c873-4d1b-8b8e-591db87f7d39\"}],\"state\":{\"visualization\":{\"layerId\":\"e7b2f1ec-c873-4d1b-8b8e-591db87f7d39\",\"layerType\":\"data\",\"metricAccessor\":\"1abfc1f6-b817-4c27-a372-9da9d84dab08\"},\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filters\":[],\"datasourceStates\":{\"formBased\":{\"layers\":{\"e7b2f1ec-c873-4d1b-8b8e-591db87f7d39\":{\"columns\":{\"1abfc1f6-b817-4c27-a372-9da9d84dab08\":{\"label\":\"Median of responseTime\",\"dataType\":\"number\",\"operationType\":\"median\",\"sourceField\":\"responseTime\",\"isBucketed\":false,\"scale\":\"ratio\",\"params\":{\"emptyAsNull\":true}}},\"columnOrder\":[\"1abfc1f6-b817-4c27-a372-9da9d84dab08\"],\"incompleteColumns\":{}}}},\"indexpattern\":{\"layers\":{}},\"textBased\":{\"layers\":{}}},\"internalReferences\":[],\"adHocDataViews\":{}}},\"enhancements\":{}},\"panelIndex\":\"d9d2dcf0-9309-487c-9fd5-de6a0666cb15\",\"gridData\":{\"x\":18,\"y\":7,\"w\":11,\"h\":7,\"i\":\"d9d2dcf0-9309-487c-9fd5-de6a0666cb15\"}}]",
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
          "id": "user-route-data",
          "name": "fc2e7853-9067-40e9-8f81-45ec869b3cd4:indexpattern-datasource-layer-aedf86a7-8b5e-47a1-94e0-2aaeeb56a443"
        },
        {
          "type": "index-pattern",
          "id": "user-route-data",
          "name": "d9d2dcf0-9309-487c-9fd5-de6a0666cb15:indexpattern-datasource-layer-e7b2f1ec-c873-4d1b-8b8e-591db87f7d39"
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
      "updated_at": "2025-04-25T06:04:48.964Z",
      "created_at": "2025-04-25T05:53:44.279Z",
      "updated_by": "u_mGBROF_q5bmFCATbLXAcCwKa0k8JvONAwSruelyKA5E_0",
      "version": "WzE2LDFd",
      "attributes": {
        "fieldAttrs": "{\"timestamp\":{\"customLabel\":\"Timestamp\"},\"program\":{\"customLabel\":\"Program\"},\"syslog_message\":{\"customLabel\":\"Message\"},\"message\":{\"count\":3}}",
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
      "id": "user-route-data",
      "type": "index-pattern",
      "namespaces": [
        "default"
      ],
      "updated_at": "2025-04-25T05:53:46.616Z",
      "created_at": "2025-04-25T05:53:46.616Z",
      "version": "WzgsMV0=",
      "attributes": {
        "fieldAttrs": "{\"@timestamp\":{\"customLabel\":\"Timestamp\"},\"message\":{\"customLabel\":\"Message\"}}",
        "title": "user-route-*",
        "sourceFilters": "[]",
        "fields": "[]",
        "fieldFormatMap": "{}",
        "runtimeFieldMap": "{}",
        "name": "Users route dataview",
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


