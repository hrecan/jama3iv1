-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: jama3iv001
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ghtdon`
--

DROP TABLE IF EXISTS `ghtdon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ghtdon` (
  `dn_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `dn_amount` decimal(10,2) NOT NULL,
  `dn_receipt_num` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dn_id`),
  UNIQUE KEY `dn_receipt_num` (`dn_receipt_num`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ghtdon_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `ghtevt` (`ev_id`),
  CONSTRAINT `ghtdon_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `ghtusr` (`us_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ghtevt`
--

DROP TABLE IF EXISTS `ghtevt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ghtevt` (
  `ev_id` int NOT NULL AUTO_INCREMENT,
  `mosque_id` int NOT NULL,
  `user_id` int NOT NULL,
  `ev_title` varchar(100) NOT NULL,
  `ev_desc` text NOT NULL,
  `ev_type` enum('donation','community_work','course') NOT NULL,
  `ev_sdate` datetime NOT NULL,
  `ev_edate` datetime NOT NULL,
  `ev_status` enum('pending','active','completed','cancelled') DEFAULT 'pending',
  `ev_taramount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ev_id`),
  KEY `mosque_id` (`mosque_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ghtevt_ibfk_1` FOREIGN KEY (`mosque_id`) REFERENCES `ghtmosq` (`ms_id`),
  CONSTRAINT `ghtevt_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `ghtusr` (`us_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ghtinv`
--

DROP TABLE IF EXISTS `ghtinv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ghtinv` (
  `in_id` int NOT NULL AUTO_INCREMENT,
  `in_text_ar` text NOT NULL,
  `in_text_fr` text NOT NULL,
  `in_text_en` text,
  `in_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`in_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ghtmosq`
--

DROP TABLE IF EXISTS `ghtmosq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ghtmosq` (
  `ms_id` int NOT NULL AUTO_INCREMENT,
  `ms_name` varchar(100) NOT NULL,
  `ms_addr` varchar(255) NOT NULL,
  `ms_city` varchar(100) NOT NULL,
  `ms_latitude` decimal(10,8) DEFAULT NULL,
  `ms_longitude` decimal(11,8) DEFAULT NULL,
  `ms_phone` varchar(20) DEFAULT NULL,
  `ms_email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ms_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ghtpar`
--

DROP TABLE IF EXISTS `ghtpar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ghtpar` (
  `pr_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `pr_amount` decimal(10,2) DEFAULT NULL,
  `pr_status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pr_id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ghtpar_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `ghtevt` (`ev_id`),
  CONSTRAINT `ghtpar_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `ghtusr` (`us_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ghtushi`
--

DROP TABLE IF EXISTS `ghtushi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ghtushi` (
  `id_histo` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_sourat` int NOT NULL,
  `temps_ecoute` time NOT NULL DEFAULT '00:00:00',
  `finich` tinyint(1) NOT NULL DEFAULT '0',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_histo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ghtusr`
--

DROP TABLE IF EXISTS `ghtusr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ghtusr` (
  `us_id` int NOT NULL AUTO_INCREMENT,
  `us_fname` varchar(50) NOT NULL,
  `us_lname` varchar(50) NOT NULL,
  `us_gender` enum('M','F') NOT NULL,
  `us_bdate` date NOT NULL,
  `us_email` varchar(100) NOT NULL,
  `us_phone` varchar(20) DEFAULT NULL,
  `us_city` varchar(100) DEFAULT NULL,
  `us_type` enum('user','mosque_admin','admin') DEFAULT 'user',
  `us_status` enum('pending','active','blocked') DEFAULT 'pending',
  `mosque_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `us_password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`us_id`),
  UNIQUE KEY `us_email` (`us_email`),
  KEY `mosque_id` (`mosque_id`),
  CONSTRAINT `ghtusr_ibfk_1` FOREIGN KEY (`mosque_id`) REFERENCES `ghtmosq` (`ms_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ghtvid`
--

DROP TABLE IF EXISTS `ghtvid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ghtvid` (
  `vd_id` int NOT NULL AUTO_INCREMENT,
  `vd_title` varchar(100) NOT NULL,
  `vd_desc` text,
  `vd_url` varchar(255) NOT NULL,
  `vd_auth` varchar(25) DEFAULT NULL,
  `vd_lang` varchar(2) NOT NULL DEFAULT 'AR',
  `vd_cate` varchar(50) NOT NULL,
  `vd_subcate` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`vd_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-19 21:00:05
