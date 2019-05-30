#!/bin/bash

# DB_ROOT_PWD=$(pwgen -s -1 14)
# DB_USER_PWD=$(pwgen -s -1 14)
# WORDPRESS_PASSWORD=$(pwgen -s -1 14)
  
startme() {
#    docker-compose up -d --build;
docker-compose up -d --build;
}

stopme() {
#    docker-compose down;
    docker-compose down;
    docker system prune --force --volumes;
}

logmysqldb() {
     docker logs -f darties_talend;
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