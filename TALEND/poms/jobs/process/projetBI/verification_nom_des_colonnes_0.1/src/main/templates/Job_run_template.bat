%~d0
cd %~dp0
java -Dtalend.component.manager.m2.repository=%cd%/../lib -Xms256M -Xmx1024M -cp .;../lib/routines.jar;../lib/log4j-1.2.17.jar;../lib/dom4j-1.6.1.jar;../lib/jxl.jar;verification_nom_des_colonnes_0_1.jar; projet_bi_5.verification_nom_des_colonnes_0_1.verification_nom_des_colonnes  %*