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
-- Table structure for table `magasin`
--

DROP TABLE IF EXISTS `magasin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `magasin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enseigne` varchar(60) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `ville` varchar(60) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `code_postal` varchar(45) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `code_departement` int(11) NOT NULL,
  `departement` varchar(45) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `region` varchar(45) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `pays` varchar(45) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idpays_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `magasin`
--

LOCK TABLES `magasin` WRITE;
/*!40000 ALTER TABLE `magasin` DISABLE KEYS */;
INSERT INTO `magasin` VALUES (49,'Darty','Alencon','',0,'','Nord_Ouest',''),(50,'Leroy_merlin','Amiens','',0,'','Nord_Ouest',''),(51,'Boulanger','Angers','',0,'','Nord_Ouest',''),(52,'Darty','Angouleme','',0,'','Nord_Ouest',''),(53,'Leroy_merlin','Arras','',0,'','Nord_Est',''),(54,'Boulanger','Bastia','',0,'','Sud_Ouest',''),(55,'Darty','Besancon','',0,'','Nord_Est',''),(56,'Darty','Bobigny','',0,'','Region_parisienne',''),(57,'Leroy_merlin','Bordeaux','',0,'','Sud_Ouest',''),(58,'Boulanger','Bourges','',0,'','Sud_Est',''),(59,'Darty','Carcassonne','',0,'','Sud_Est',''),(60,'Leroy_merlin','Cergy_Pontoise','',0,'','Region_parisienne',''),(61,'Boulanger','Chambery','',0,'','Sud_Est',''),(62,'Darty','Clermont_Ferrand','',0,'','Sud_Est',''),(63,'Darty','Creteil','',0,'','Region_parisienne',''),(64,'Leroy_merlin','Digne','',0,'','Sud_Est',''),(65,'Boulanger','Dijon','',0,'','Nord_Est',''),(66,'Darty','Evry','',0,'','Region_parisienne',''),(67,'Leroy_merlin','Foix','',0,'','Sud_Est',''),(68,'Boulanger','Grenoble','',0,'','Nord_Est',''),(69,'Darty','Lille','',0,'','Nord_Ouest',''),(70,'Darty','Limoges','',0,'','Sud_Ouest',''),(71,'Darty','Lyon','',0,'','Sud_Est',''),(72,'Leroy_merlin','Marseille','',0,'','Sud_Est',''),(73,'Boulanger','Melun','',0,'','Nord_Ouest',''),(74,'Darty','Metz','',0,'','Nord_Est',''),(75,'Leroy_merlin','Nimes','',0,'','Sud_Est',''),(76,'Boulanger','Nancy','',0,'','Nord_Est',''),(77,'Darty','Nanterre','',0,'','Nord_Ouest',''),(78,'Darty','Nantes','',0,'','Nord_Ouest',''),(79,'Leroy_merlin','Nice','',0,'','Sud_Est',''),(80,'Boulanger','Perigueux','',0,'','Sud_Ouest',''),(81,'Darty','Paris_Nord','',0,'','Region_parisienne',''),(82,'Leroy_merlin','Paris_Sud','',0,'','Region_parisienne',''),(83,'Darty','Pau','',0,'','Sud_Est',''),(84,'Leroy_merlin','Quimper','',0,'','Nord_Ouest',''),(85,'Boulanger','Rodez','',0,'','Sud_Ouest',''),(86,'Darty','Rouen','',0,'','Nord_Ouest',''),(87,'Leroy_merlin','St_Brieuc','',0,'','Nord_Ouest',''),(88,'Boulanger','St_Etienne','',0,'','Sud_Est',''),(89,'Darty','Strasbourg','',0,'','Nord_Est',''),(90,'Darty','Tarbes','',0,'','Sud_Ouest',''),(91,'Leroy_merlin','Toulon','',0,'','Sud_Ouest',''),(92,'Boulanger','Tours','',0,'','Sud_Ouest',''),(93,'Darty','Troyes','',0,'','Nord_Est',''),(94,'Leroy_merlin','Valence','',0,'','Sud_Ouest',''),(95,'Boulanger','Valenciennes','',0,'','Nord_Est',''),(96,'Darty','Versailles','',0,'','Region_parisienne','');
/*!40000 ALTER TABLE `magasin` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-28 11:13:32
