all : build up 

start : up

stop : down

build :
	docker-compose build 

up :
	docker-compose up -d

down :
	docker-compose down

logs :
	docker-compose logs -f

destroy:
	docker-compose down --rmi all -v

clean : destroy
	docker system prune -af
	rm -rf ./tmp/

re : clean all

d-logs :
	rm -rf ./logs/*

.PHONY: all build up down logs clean destroy re start stop