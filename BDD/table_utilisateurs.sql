-- MySQL dump 10.13  Distrib 8.0.11, for Win64 (x86_64)
--
-- Host: localhost    Database: darties_db
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(56) NOT NULL,
  `profile` varchar(45) NOT NULL,
  `pays` varchar(45) NOT NULL,
  `region` varchar(45) DEFAULT NULL,
  `magasin` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Directeur commercial','dc','c175e7977a1ae9d0014cbe6b4660b5845d54df271da93fd9de3d9243','Directeur commercial','France',NULL,NULL),(3,'Directeur région parisienne','drrp','6b085a8e909cfe1217e317c706eeafdcbadcc339b111d2ebbfa5d7f6','Directeur Régional','France','Region parisienne',NULL),(4,'Directeur nord ouest','drno','14eb6115c6836ddd5430d687fbf5bb4dece9b3d6fe04656e4a5480b1','Directeur Régional','France','Nord Ouest',NULL),(5,'Directeur nord est','drne','6f28fe21b8f570da631eabb7b11f7ca753ae62c321ac3604486817c1','Directeur Régional','France','Nord Est',NULL),(6,'Directeur sud ouest','drso','a75c3bae0e40b99d466fa86016e53bb2ccd3aaf7cdd2a431fe906ef5','Directeur Régional','France','Nord Ouest',NULL),(7,'Directeur sud est','drse','d2f4b7fdb4a2042bc3cf67aff3374f192da4422b27e3f556bdbf0889','Directeur Régional','France','Sud Est',NULL),(13,'Responsable magasin Bobigny','rmbobigny','92dea01a68c509173cdb8bd4047587409ea4040d5208ace7e97e53a8','Responsable magasin','France','Région Parisienne','Bobigny'),(14,'Responsable magasin Amiens','rmamiens','fc8730c1aa4d936cd5f77ce9e9c1834df2061382b41f3cf9645da29d','Responsable magasin','France','Nord Est','Amiens'),(15,'Responsable magasin Alençon','rmalencon','948d88f6c466efcb58a7617d615df4ad40071517ef7d32ad72364d48','Responsable magasin','France','Nord Ouest','Alencon'),(16,'Responsable magasin Bastia','rmbastia','991df74c1d66d01d6174c33dcdc54f3e2cc43812e23430ca370aba66','Responsable magasin','France','Sud Est','Bastia'),(17,'Responsable magasin Angouleme','rmangouleme','91fcecd9753db6abfc53501b09eeca734b91e8986a161bb9f185d380','Responsable magasin','France','Sud Ouest','Angouleme');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-01 21:59:56
