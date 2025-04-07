FROM alpine

RUN apk add --no-cache bash curl 
USER '0'

COPY ./ilm.sh ./ilm.sh 
RUN chmod +x ./ilm.sh


CMD ["/bin/sh", "-c", "sleep 15 && ./ilm.sh"]