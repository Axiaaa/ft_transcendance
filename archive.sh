#!/bin/bash

mkdir -p /var/log/archives

timestamp=$(date +"%Y%m%d%H%M%S")
archive_file="/var/log/archives/logs_archive_$timestamp.tar"
find /var/log/logs -type f -name "*.log" -exec tar -rvf "$archive_file" {} \; -exec rm {} \;
