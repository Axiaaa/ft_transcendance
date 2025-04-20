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
	docker-compose down -v --remove-orphans

clean : destroy
	docker system prune -af
	docker volume prune -f
	rm -rf frontend/.build
		
re : destroy all

.PHONY: all build up down logs clean destroy re start stop