$fileDir = Split-Path -Parent $MyInvocation.MyCommand.Path
cd $fileDir
java '-Dtalend.component.manager.m2.repository=%cd%/../lib' '-Xms256M' '-Xmx1024M' '-Dfile.encoding=UTF-8' -cp '.;../lib/routines.jar;../lib/log4j-1.2.17.jar;../lib/dom4j-1.6.1.jar;verification_annee_fichier_0_1.jar;' projet_bi_2.verification_annee_fichier_0_1.verification_annee_fichier  %*