FROM alpine

RUN apk add --no-cache bash curl 
USER '0'

COPY ./dataviews.sh ./dataviews.sh 
RUN chmod +x ./dataviews.sh

CMD ["sleep", "infinity"]
# CMD ["sh", "-c", "while true; do sleep 1000; done"]