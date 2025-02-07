all : build up 

start : up

stop : down

build :

#Create tmp folder with permissions so that services can log into them

	if [ ! -d "./.tmp" ]; then \
		mkdir -p ./.tmp/; \
		mkdir -p ./.tmp/elasticsearch/; \
		chmod -R 777 ./.tmp/elasticsearch/; \
		sudo chown -R 1000:1000 ./.tmp/elasticsearch/; \
		mkdir -p ./.tmp/kibana/; \
		chmod -R 777 ./.tmp/kibana/; \
		sudo chown -R 1000:1000 ./.tmp/kibana/; \
	fi

	docker-compose build 

up :
	docker-compose up -d

down :
	docker-compose down

logs :
	docker-compose logs -f

destroy:
	docker-compose down -v

clean : destroy
#docker system prune -af
	sudo rm -rf ./.tmp/

cleanlogs : 
	sudo rm -rf ./.tmp/
	
re : clean all

d-logs :
	rm -rf ./logs/*

.PHONY: all build up down logs clean destroy re start stop