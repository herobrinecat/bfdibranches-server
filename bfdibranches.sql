-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: bfdibranches
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

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
-- Table structure for table `bfdibranchesaccount`
--

DROP TABLE IF EXISTS `bfdibranchesaccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bfdibranchesaccount` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `points` bigint NOT NULL DEFAULT '0',
  `user_rank` bigint NOT NULL DEFAULT '1',
  `username` varchar(255) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `bio` varchar(2000) DEFAULT '',
  `date` varchar(255) DEFAULT NULL,
  `branchcoins` bigint DEFAULT '0',
  `moderator` tinyint(1) DEFAULT '0',
  `badges` varchar(255) NOT NULL DEFAULT '[]',
  `foreground` bigint NOT NULL DEFAULT '0',
  `background` bigint NOT NULL DEFAULT '0',
  `frame` bigint NOT NULL DEFAULT '0',
  `usernameColor` varchar(255) NOT NULL DEFAULT '[0,0]',
  `lastonline` varchar(255) NOT NULL,
  `foregroundsowned` varchar(500) NOT NULL DEFAULT '[0,1,2,3]',
  `backgroundsowned` varchar(500) NOT NULL DEFAULT '[0,1,2,3,4,5]',
  `rewardavailable` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bfdibranchesaccount`
--

LOCK TABLES `bfdibranchesaccount` WRITE;
/*!40000 ALTER TABLE `bfdibranchesaccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `bfdibranchesaccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bfdibrancheslevel`
--

DROP TABLE IF EXISTS `bfdibrancheslevel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bfdibrancheslevel` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `description` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `difficulty` smallint NOT NULL DEFAULT '1',
  `icon` smallint NOT NULL,
  `data` mediumtext COLLATE utf8mb3_bin NOT NULL,
  `dataLen` bigint NOT NULL,
  `spotlight` tinyint(1) DEFAULT '0',
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `completedtime` varchar(255) COLLATE utf8mb3_bin NOT NULL DEFAULT '',
  `creatortime` varchar(255) COLLATE utf8mb3_bin NOT NULL DEFAULT '',
  `username` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `date` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `peoplebeaten` varchar(256) COLLATE utf8mb3_bin NOT NULL DEFAULT '[]',
  `background` bigint NOT NULL DEFAULT '0',
  `foreground` bigint NOT NULL DEFAULT '0',
  `version` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `levelVersion` bigint NOT NULL DEFAULT '1',
  `worldrecordtime` varchar(255) COLLATE utf8mb3_bin NOT NULL DEFAULT '0.00',
  `characterOnly` tinyint NOT NULL DEFAULT '-1',
  `worldrecordholder` varchar(255) COLLATE utf8mb3_bin NOT NULL DEFAULT 'Nobody',
  `firstcompleter` varchar(255) COLLATE utf8mb3_bin NOT NULL DEFAULT 'Nobody',
  `lastcompleter` varchar(255) COLLATE utf8mb3_bin NOT NULL DEFAULT 'Nobody',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bfdibrancheslevel`
--

LOCK TABLES `bfdibrancheslevel` WRITE;
/*!40000 ALTER TABLE `bfdibrancheslevel` DISABLE KEYS */;
/*!40000 ALTER TABLE `bfdibrancheslevel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bfdibranchesreport`
--

DROP TABLE IF EXISTS `bfdibranchesreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bfdibranchesreport` (
  `reportid` bigint NOT NULL AUTO_INCREMENT,
  `leveltitle` varchar(200) COLLATE utf8mb3_bin NOT NULL,
  `levelcreatorname` varchar(200) COLLATE utf8mb3_bin NOT NULL,
  `levelcreatorid` bigint NOT NULL,
  `reportername` varchar(200) COLLATE utf8mb3_bin NOT NULL,
  `date` varchar(200) COLLATE utf8mb3_bin NOT NULL,
  `resolved` tinyint(1) NOT NULL DEFAULT '0',
  `description` text COLLATE utf8mb3_bin NOT NULL,
  `levelid` bigint NOT NULL,
  PRIMARY KEY (`reportid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bfdibranchesreport`
--

LOCK TABLES `bfdibranchesreport` WRITE;
/*!40000 ALTER TABLE `bfdibranchesreport` DISABLE KEYS */;
/*!40000 ALTER TABLE `bfdibranchesreport` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-12 22:50:03
