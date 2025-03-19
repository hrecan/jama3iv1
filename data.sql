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
-- Dumping data for table `ghtdon`
--

LOCK TABLES `ghtdon` WRITE;
/*!40000 ALTER TABLE `ghtdon` DISABLE KEYS */;
/*!40000 ALTER TABLE `ghtdon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ghtevt`
--

LOCK TABLES `ghtevt` WRITE;
/*!40000 ALTER TABLE `ghtevt` DISABLE KEYS */;
INSERT INTO `ghtevt` VALUES (1,1,2,'Cours de Coran','Cours hebdomadaire','course','2024-03-20 18:00:00','2024-03-20 20:00:00','pending',NULL,'2025-01-05 17:17:57'),(2,1,2,'Collecte pour la mosquÔö£┬«e','Collecte mensuelle','donation','2024-03-25 09:00:00','2024-03-25 18:00:00','pending',NULL,'2025-01-05 17:17:57');
/*!40000 ALTER TABLE `ghtevt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ghtinv`
--

LOCK TABLES `ghtinv` WRITE;
/*!40000 ALTER TABLE `ghtinv` DISABLE KEYS */;
/*!40000 ALTER TABLE `ghtinv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ghtmosq`
--

LOCK TABLES `ghtmosq` WRITE;
/*!40000 ALTER TABLE `ghtmosq` DISABLE KEYS */;
INSERT INTO `ghtmosq` VALUES (1,'MosquÔö£┬«e Al-Salam','123 Rue de la Paix','Marseille',43.29648200,5.36978000,NULL,NULL,'2025-01-05 17:17:57'),(2,'MosquÔö£┬«e Al-Nour','456 Avenue de la LumiÔö£┬┐re','Marseille',43.30984100,5.36958900,NULL,NULL,'2025-01-05 17:17:57'),(3,'Mosqu??e Al-Salam','123 Rue de la Paix','Marseille',43.29648200,5.36978000,NULL,NULL,'2025-01-05 17:23:20'),(4,'Mosqu??e Al-Nour','456 Avenue de la Lumi??re','Marseille',43.30984100,5.36958900,NULL,NULL,'2025-01-05 17:23:20');
/*!40000 ALTER TABLE `ghtmosq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ghtpar`
--

LOCK TABLES `ghtpar` WRITE;
/*!40000 ALTER TABLE `ghtpar` DISABLE KEYS */;
/*!40000 ALTER TABLE `ghtpar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ghtushi`
--

LOCK TABLES `ghtushi` WRITE;
/*!40000 ALTER TABLE `ghtushi` DISABLE KEYS */;
INSERT INTO `ghtushi` VALUES (1,7,1,'00:01:00',1,'2025-02-25 00:22:09'),(2,7,114,'00:01:00',1,'2025-02-25 00:23:43'),(3,1,1,'00:01:00',1,'2025-03-19 17:37:19'),(4,1,1,'00:01:00',1,'2025-03-19 18:35:35'),(5,1,109,'00:01:00',1,'2025-03-19 18:36:43'),(6,1,97,'00:01:00',1,'2025-03-19 18:37:37');
/*!40000 ALTER TABLE `ghtushi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ghtusr`
--

LOCK TABLES `ghtusr` WRITE;
/*!40000 ALTER TABLE `ghtusr` DISABLE KEYS */;
INSERT INTO `ghtusr` VALUES (2,'Mohamed','Imam','M','1985-05-15','imam@mosque.fr',NULL,NULL,'mosque_admin','active',NULL,'2025-01-05 17:17:57',NULL),(5,'Admin','System','M','1990-01-01','admin@jama3i.com',NULL,'System','admin','active',NULL,'2025-02-22 23:54:05','$2b$10$eNI8y3ErejmLJ8dMUyiDTOL6NhZrtoG98N/2v9/9/WRKUNgQHgiiK'),(7,'harti','nacer','M','1988-08-16','harti.nacer@gmail.com','0618449478','harti.nacer@gmail.com','user','active',NULL,'2025-02-23 19:55:43','$2b$10$69gXrAPvLayYsL6pKpkXgu3dZDL/0Mqel7ADbpjBptMV/sF01WWei'),(8,'benfatah','asmae','F','1991-01-01','asmae.benfatah@gmail.com','0665517889','bezons','user','pending',NULL,'2025-02-24 18:43:01','$2b$10$g/hI6LileWoLCspKpo1S6O0Cyx9HfSTsPf/OZVfrm8zOpijWwqHz.');
/*!40000 ALTER TABLE `ghtusr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ghtvid`
--

LOCK TABLES `ghtvid` WRITE;
/*!40000 ALTER TABLE `ghtvid` DISABLE KEYS */;
INSERT INTO `ghtvid` VALUES (1,'Al-Baqarah (La Vache)',NULL,'ieHCmmiYKIQ',NULL,'AR','4','1','2025-01-05 17:59:07'),(2,'Al-Kahf (La Caverne)',NULL,'-FxEYa8joK8',NULL,'AR','4','1','2025-01-05 17:59:34'),(3,'Al-Baqarah (La Vache)','Sourate Al-Baqarah (La Vache) ','ieHCmmiYKIQ',NULL,'AR','1','1','2025-02-23 14:20:00'),(4,'comment le prophete changer les habitudes des gens','comment le proph├¿te changer les habitudes des gens','NjfJUe2aNh8','MDM','ar','1','1','2025-02-23 14:49:22'),(5,'Histoires des proph├¿tes','Adam le premier proph├¿te (1/2)','IStYkBOAlx0',' L\'Islam simplement','ar','4','1','2025-02-23 15:19:24'),(6,'Histoires des proph├¿tes','Adam le premier Proph├¿te-Histoire des proph├¿tes-2/2','J3kRdR0Nxjo',' L\'Islam simplement','ar','4','1','2025-02-23 15:20:17'),(7,'┘â┘è┘ü Ï«┘ä┘é Ïº┘ä┘ä┘ç Ï│┘èÏ»┘åÏº ÏºÏ»┘à.. ┘ê┘â┘è┘ü Ï╣ÏºÏ┤ Ï╣┘ä┘ë Ïº┘äÏúÏ▒ÏÂ Ï¿Ï╣Ï» ÏÀÏ▒Ï»┘ç ┘à┘å Ïº┘äÏ¼┘å┘ç Ïƒ','┘â┘è┘ü Ï«┘ä┘é Ïº┘ä┘ä┘ç Ï│┘èÏ»┘åÏº ÏºÏ»┘à.. ┘ê┘â┘è┘ü Ï╣ÏºÏ┤ Ï╣┘ä┘ë Ïº┘äÏúÏ▒ÏÂ Ï¿Ï╣Ï» ÏÀÏ▒Ï»┘ç ┘à┘å Ïº┘äÏ¼┘å┘ç Ïƒ','EtD-FQxEI7k','Ahmed_Said','ar','4','1','2025-02-23 15:29:17');
/*!40000 ALTER TABLE `ghtvid` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-19 21:00:17
