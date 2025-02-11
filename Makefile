all : build up 

start : up

stop : down

build :

#Create tmp folder with permissions so that services can log into them

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
		
re : destroy all

.PHONY: all build up down logs clean destroy re start stop