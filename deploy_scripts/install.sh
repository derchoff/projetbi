#!/bin/bash

# DB_ROOT_PWD=$(pwgen -s -1 14)
# DB_USER_PWD=$(pwgen -s -1 14)
# WORDPRESS_PASSWORD=$(pwgen -s -1 14)
  
startme() {

    #pwgen n'est pas installer sur la VPS  et je ne souhaite pas gérer une installation via le script
    DB_ROOT_PWD=`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo ''`;

    echo '---------------------------------------';
    echo '| GENERATED PASSWORD';
    echo "| Root            : $DB_ROOT_PWD";    
    echo '---------------------------------------';

    export DB_ROOT_PWD;

    docker-compose up -d --build;
    
    #attend que la bdd mysql soit instancié
    until nc -z -v -w30 mysqldb 3306;
    do
        echo "Waiting for database connection..."
        # wait for 5 seconds before check again
        sleep 5
    done;
    
    echo $PWD;
    
    echo 'execute le script SQL pour installer les tables de bdd'
    mysql db_name < ../BDD/MCD_2019_04_28.sql
    
    $ mysql -h  mysqldb -u "root" "-p${DB_ROOT_PWD}" "db_darties" < "../BDD/MCD_2019_04_28.sql";   
}

stopme() {
    docker-compose down;
    docker system prune --force;
}

case "$1" in 
    start)   startme ;;
    stop)    stopme ;;
    restart) stopme; startme ;;
    *) echo "usage: $0 start|stop|restart" >&2
       exit 1
       ;;
esac