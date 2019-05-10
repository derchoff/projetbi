#!/bin/bash

# DB_ROOT_PWD=$(pwgen -s -1 14)
# DB_USER_PWD=$(pwgen -s -1 14)
# WORDPRESS_PASSWORD=$(pwgen -s -1 14)
  
startme() {

    #pwgen n'est pas installer sur la VPS  et je ne souhaite pas gérer une installation via le script
    DB_ROOT_PWD=`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo ''`;    
    TOMCAT_PWD=`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo ''`;    
    BI_SRC_PATH="/usr/src/projetbi/BDD";

    echo '---------------------------------------';
    echo '| GENERATED PASSWORD';
    echo "| Db Root            : $DB_ROOT_PWD";    
    echo "| Tomcat Root        : $TOMCAT_PWD";    
    echo '---------------------------------------';

    export DB_ROOT_PWD;
    export TOMCAT_PWD;

    mkdir /usr/src/tomcat;
    
    docker-compose up -d --build;
        
    sudo cp /usr/src/projetbi/web-service/SiteWeb_DARTIES/dist/SiteWeb_DARTIES.war /usr/src/tomcat/tomcat/data/;
    sudo cp /usr/src/projetbi/web-service/WebService_DARTIES/dist/WebService_DARTIES.war /usr/src/tomcat/tomcat/data/;
    
    #attend que la bdd mysql soit instancié
#    until nc -z -v -w30 localhost 3306;
#    do
#        echo "Waiting for database connection..."
        # wait for 5 seconds before check again
#        sleep 5
#    done;   
    
#    echo 'execute le script SQL pour installer les tables de bdd'
#    docker exec mysqldb /bin/bash -c 'chown -R mysql:mysql /var/lib/mysql'
#   docker exec mysqldb /bin/bash -c "mysql -h mysqldb -u root -p$DB_ROOT_PWD db_darties < $BI_SRC_PATH/MCD_2019_04_28.sql";
}

stopme() {
    docker-compose down;
    docker system prune --force --volumes;
}

logmysqldb() {
     docker logs -f mysqldb;
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