#!/bin/sh
cd `dirname $0`
ROOT_PATH=`pwd`
java -Dtalend.component.manager.m2.repository=$ROOT_PATH/../lib -Xms256M -Xmx1024M -Dfile.encoding=UTF-8 -cp .:$ROOT_PATH:$ROOT_PATH/../lib/routines.jar:$ROOT_PATH/../lib/log4j-1.2.17.jar:$ROOT_PATH/../lib/dom4j-1.6.1.jar:$ROOT_PATH/verification_annee_fichier_0_1.jar: projet_bi_2.verification_annee_fichier_0_1.verification_annee_fichier  "$@"