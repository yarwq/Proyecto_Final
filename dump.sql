-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: draftosaurus
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `partida_jugadores`
--

DROP TABLE IF EXISTS `partida_jugadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partida_jugadores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partida_id` int(11) NOT NULL,
  `jugador_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `partida_id` (`partida_id`),
  KEY `jugador_id` (`jugador_id`),
  CONSTRAINT `partida_jugadores_ibfk_1` FOREIGN KEY (`partida_id`) REFERENCES `partidas` (`id`),
  CONSTRAINT `partida_jugadores_ibfk_2` FOREIGN KEY (`jugador_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partida_jugadores`
--

LOCK TABLES `partida_jugadores` WRITE;
/*!40000 ALTER TABLE `partida_jugadores` DISABLE KEYS */;
INSERT INTO `partida_jugadores` VALUES (1,4,1),(2,4,2),(3,5,1),(4,5,2),(5,6,1),(6,6,2),(7,7,1),(8,7,2);
/*!40000 ALTER TABLE `partida_jugadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidas`
--

DROP TABLE IF EXISTS `partidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partidas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `num_jugadores` int(11) NOT NULL,
  `jugador_actual` int(11) NOT NULL,
  `turno` int(11) NOT NULL,
  `zoologicos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`zoologicos`)),
  `manos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`manos`)),
  `fecha` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidas`
--

LOCK TABLES `partidas` WRITE;
/*!40000 ALTER TABLE `partidas` DISABLE KEYS */;
INSERT INTO `partidas` VALUES (1,2,1,1,'{\"1\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"2\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]}}','{\"1\":[{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"}],\"2\":[{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"},{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"}]}','2025-10-09 20:51:55'),(2,2,2,1,'{\"1\":{\"campo\":[],\"montevideo\":[],\"rivera\":[{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"}],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"2\":{\"campo\":[{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"montevideo\":[],\"rivera\":[{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"}],\"moscu\":[{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"}],\"cheliabinsk\":[],\"transiberiano\":[{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"rio\":[]}}','{\"1\":[{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"}],\"2\":[]}','2025-10-09 20:55:21'),(3,2,1,2,'{\"1\":{\"campo\":[],\"montevideo\":[],\"rivera\":[{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"}],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"2\":{\"campo\":[{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"}],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]}}','{\"1\":[{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"},{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"}],\"2\":[{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"}]}','2025-10-09 21:35:09'),(4,2,1,2,'{\"1\":{\"campo\":[],\"montevideo\":[],\"rivera\":[{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"}],\"moscu\":[{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"}],\"cheliabinsk\":[],\"transiberiano\":[{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"}],\"rio\":[]},\"2\":{\"campo\":[{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]}}','{\"1\":[{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"}],\"2\":[{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"}]}','2025-10-09 21:45:36'),(5,2,1,1,'{\"1\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"2\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]}}','{\"1\":[{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"}],\"2\":[{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"}]}','2025-10-09 21:53:32'),(6,5,1,2,'{\"1\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"}],\"rio\":[]},\"2\":{\"campo\":[{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"3\":{\"campo\":[],\"montevideo\":[],\"rivera\":[{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"4\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"}],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"5\":{\"campo\":[],\"montevideo\":[],\"rivera\":[{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"}],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]}}','{\"1\":[{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"}],\"2\":[{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"3\":[{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"}],\"4\":[{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"5\":[{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"}]}','2025-10-09 22:02:37'),(7,4,1,1,'{\"1\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"2\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"3\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]},\"4\":{\"campo\":[],\"montevideo\":[],\"rivera\":[],\"moscu\":[],\"cheliabinsk\":[],\"transiberiano\":[],\"rio\":[]}}','{\"1\":[{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"2\":[{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"3\":[{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"},{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"},{\"nombre\":\"Bronto\",\"imagen\":\"Yellow.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}],\"4\":[{\"nombre\":\"Triceratops\",\"imagen\":\"green.png\"},{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"},{\"nombre\":\"Raptor\",\"imagen\":\"violet.png\"},{\"nombre\":\"Ptera\",\"imagen\":\"blue.png\"},{\"nombre\":\"Stego\",\"imagen\":\"light blue.png\"},{\"nombre\":\"T-Rex\",\"imagen\":\"red.png\"}]}','2025-10-09 22:11:26');
/*!40000 ALTER TABLE `partidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'yarwq05@gmail.com','','$2y$10$4z.18WePRRX1BKKv0F6CNeebAvBgINIncJOgNcHp2h4kPSBlTEv.S','2025-09-09 18:47:30'),(2,'yarwg05@gmail.com','','$2y$10$OuzzFHxm8eemFM1BC/N5hO4AYTwOU0Zmmz66e4.IlytF3CwwU4l/e','2025-09-09 18:50:20'),(3,'saidfnasu@gmail.com','','$2y$10$QdrANBgjlW5eiFNAlK2VCeFmPOJqLMaauYu7opl7A73qbYt6Gs2JW','2025-09-09 21:40:40'),(4,'saidfnasusaidfnasu@gmail.com','12341234','$2y$10$mQ38X7WywtVBGwV9.3wgzOtKXyi8xl4sZ1anOLy.EEu771IWvbpIi','2025-09-10 19:11:47'),(5,'SDFGSDGSDFG5@gmail.com','JEFF','$2y$10$CSx4SJ5uezDx5rnQ5kNPRuKGQc8pnODdZ3sF2evzGCUzOaNxFFpW2','2025-09-11 02:25:16'),(6,'ysrdf@dfgksn.cmop','12341234','$2y$10$XJQrHEo197VodZv.iuNBmeMOPZi8WscHlICVAGoet8HC1G0/feX1S','2025-09-14 19:34:43'),(7,'asdf@gand.com','11111111','$2y$10$OKQ8HrVCRoaqlfidKvDl3OGnGXF9DYbzKxqA0yT4O.HYFaO9Pzc6a','2025-09-14 19:36:12'),(8,'sddfsd@gmail.com','sddfsd@gmail.comsddfsd@gmail.com','$2y$10$C.6OUgxXKvjHsczcVGDjLO6tZYvAOITRnqRLTYQ/13DpGM.w.ZOnC','2025-09-14 19:59:37'),(9,'234su@gmail.com','234su@gmail.com234su@gmail.com','$2y$10$fn7R0OcaT0wz8FElRD5vH.shjQjvh6Te.BvwQrNavg8hsCSqPGQ9i','2025-09-14 20:01:13'),(10,'dfsjhgb@gmail.com','dfsjhgb@gmail.comdfsjhgb@gmail.com','$2y$10$bddiqz/I8tz.FUMKj20cy.Of6Vk/l4woXTfUw3njBgdgG4o2ErG0K','2025-09-14 20:02:56'),(11,'yaeeeee@gmail.com','111111','$2y$10$tid6E32GtrKawbtAjoAiAORGT32sIh0ZmYmch9JM9ziLYPZY4Srfi','2025-09-14 23:40:14'),(12,'yyy@gmail.com','yyy@gmail.com','$2y$10$uLe3q0hKchJ0xl7fMPrWP.1eIolZFB9SKjFJ5NjpxCcZpRaiL/6Y6','2025-09-14 23:43:21'),(13,'joaquin@gmai.com','joaquin@gmai.com','$2y$10$IVbaH0ojSmUxna.dpgldyu9Em2GMFAdGp4nI6FCOD4tjMj6f0SkMu','2025-09-15 00:03:23'),(14,'ya05@gmail.com','111111','$2y$10$l2sq62w5HcsgZr6sNseXPeqRvsqS7b2JC/cYQpLyC3S2tELkxUIOi','2025-09-15 01:03:21'),(15,'111q05@gmail.com','1212','$2y$10$uEnfvEuTFlDv9vnN3rd5/uHj73e1gQ5.zeuINhQ6C5scyDwcta5um','2025-09-15 03:08:24'),(16,'polina@gmail.com','polina@gmail.com','$2y$10$NQoAuFHfNsPBbKN2fTobSeHtDfW1gdB7HAZdtybF57c9sRKCmhYDe','2025-09-15 16:01:19'),(17,'214kawbef@gmail.com','214kawbef@gmail.com','$2y$10$/8vICnoFlk2VvrsMwrna6OiykuQn2LTM7SZmarKCa64ZlYjLEmcvi','2025-10-09 19:45:11'),(18,'fsafd234@gmail.com','fsafd234@gmail.com','$2y$10$kwpntG/Q.9YCIEFw3clbV.KO7oWs1JK4euyUky1fZlCbwzrYI9NGS','2025-10-09 20:46:08');
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

-- Dump completed on 2025-10-09 20:20:45
