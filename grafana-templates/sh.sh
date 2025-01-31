# Always make a copy before editing with sed
cp django.json django.json.bac
# Replaces using regex and saves the file
sed -i -E 's/"datasource":\s*(".*"|\{[\s\S]*?\})/"datasource": null/g' elasticsearch.json