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

defaultuser : 
	curl -k -X POST https://localhost/api/users/login \
       -H "Content-Type: application/json" \
	   -d '{"username": "$(shell grep DEFAULT_USER .env | cut -d '=' -f2)", "password": "$(shell grep DEFAULT_PASSWORD .env | cut -d '=' -f2)"}'

.PHONY: all build up down logs clean destroy re start stop defaultuser