FROM alpine

RUN apk add --no-cache bash curl 
USER '0'

COPY ./dataviews.sh ./dataviews.sh 
RUN chmod +x ./dataviews.sh

COPY ./dashboards.sh ./dashboards.sh
RUN chmod +x ./dashboards.sh

CMD ["/bin/sh", "-c", "sleep 15 && ./dataviews.sh && ./dashboards.sh"]