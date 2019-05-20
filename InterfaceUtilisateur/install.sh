#!/bin/bash

# DB_ROOT_PWD=$(pwgen -s -1 14)
# DB_USER_PWD=$(pwgen -s -1 14)
# WORDPRESS_PASSWORD=$(pwgen -s -1 14)
  
startme() {
    
#    docker-compose up -d --build;
docker run -d -p 8081:8081 --name darties_app darties-app:1.0.0 npm start;   
}

stopme() {
#    docker-compose down;
    docker stop darties_app;
    docker system prune --force --volumes;
}

logmysqldb() {
     docker logs -f darties_app;
}

case "$1" in 
    start)   startme ;;
    stop)    stopme ;;
    restart) stopme; startme ;;
    log) logmysqldb ;;
    *) echo "usage: $0 start|stop|restart" >&2
       exit 1
       ;;
esac