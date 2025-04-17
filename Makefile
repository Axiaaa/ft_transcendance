all : build up 

start : up

stop : down

ts : 
	npx tsc -p frontend/tsconfig.json

gamets : 
	npx tsc -p frontend/game/tsconfig.json

build : ts gamets
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
	rm -rf ./frontend/game/.build
	rm -rf ./frontend/ts/.build
	docker system prune -af
		
re : destroy all

.PHONY: all build up down logs clean destroy re start stop
