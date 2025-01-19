import logging
from pythonjsonlogger import jsonlogger

http_method = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS',
    'TRACE',
    'CONNECT'
]

class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super().add_fields(log_record, record, message_dict)
        log_record['loglevel'] = record.levelname
        log_record['http_method'] = record.args[0].split(' ')[0] if record.args[0].split(' ')[0] in http_method else 'UNKNOWN'