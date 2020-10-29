/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: medical_sample_db
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aliquots`
--

DROP TABLE IF EXISTS `aliquots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aliquots` (
  `aliquot_id` int NOT NULL AUTO_INCREMENT,
  `sample_id` int NOT NULL,
  `location_id` int NOT NULL,
  `status_id` int NOT NULL,
  `freezer_id` int DEFAULT NULL,
  PRIMARY KEY (`aliquot_id`),
  KEY `aliquots_fk0` (`sample_id`),
  KEY `aliquots_fk1` (`location_id`),
  KEY `aliquots_fk2` (`status_id`),
  KEY `aliquots_fk3` (`freezer_id`),
  CONSTRAINT `aliquots_fk0` FOREIGN KEY (`sample_id`) REFERENCES `samples` (`sample_id`),
  CONSTRAINT `aliquots_fk1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`),
  CONSTRAINT `aliquots_fk2` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`status_id`),
  CONSTRAINT `aliquots_fk3` FOREIGN KEY (`freezer_id`) REFERENCES `freezers` (`freezer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aliquots`
--

LOCK TABLES `aliquots` WRITE;
/*!40000 ALTER TABLE `aliquots` DISABLE KEYS */;
INSERT INTO `aliquots` VALUES (1,543,1,1,1),(2,557,2,2,2),(3,575,3,3,3),(4,578,4,4,4),(5,613,5,5,5),(6,615,6,6,6),(7,649,7,7,7),(8,661,8,8,8),(9,767,9,9,9),(10,773,10,10,10);
/*!40000 ALTER TABLE `aliquots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `freezers`
--

DROP TABLE IF EXISTS `freezers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `freezers` (
  `freezer_id` int NOT NULL AUTO_INCREMENT,
  `lab_name` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `storage_temp` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`freezer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `freezers`
--

LOCK TABLES `freezers` WRITE;
/*!40000 ALTER TABLE `freezers` DISABLE KEYS */;
INSERT INTO `freezers` VALUES (1,'id','-4.25'),(2,'fugit','12.55'),(3,'rerum','21.99'),(4,'blanditiis','28.1'),(5,'voluptas','-3.5'),(6,'labore','-14.96'),(7,'deserunt','-18.39'),(8,'ipsam','-3.29'),(9,'doloribus','18.88'),(10,'pariatur','-3.37');
/*!40000 ALTER TABLE `freezers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location_history`
--

DROP TABLE IF EXISTS `location_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location_history` (
  `aliquot_id` int NOT NULL,
  `sample_id` int NOT NULL,
  `shipment_id` int NOT NULL,
  `location_history_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`location_history_id`),
  KEY `location_history_fk0` (`aliquot_id`),
  KEY `location_history_fk1` (`sample_id`),
  KEY `location_history_fk2` (`shipment_id`),
  CONSTRAINT `location_history_fk0` FOREIGN KEY (`aliquot_id`) REFERENCES `aliquots` (`aliquot_id`),
  CONSTRAINT `location_history_fk1` FOREIGN KEY (`sample_id`) REFERENCES `aliquots` (`sample_id`),
  CONSTRAINT `location_history_fk2` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`shipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location_history`
--

LOCK TABLES `location_history` WRITE;
/*!40000 ALTER TABLE `location_history` DISABLE KEYS */;
INSERT INTO `location_history` VALUES (1,543,1,1),(2,557,2,2),(3,575,3,3),(4,578,4,4),(5,613,5,5),(6,615,6,6),(7,649,7,7),(8,661,8,8),(9,767,9,9),(10,773,10,10);
/*!40000 ALTER TABLE `location_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`location_id`),
  KEY `locations_fk0` (`user_id`),
  CONSTRAINT `locations_fk0` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Nobis nam aut omnis ea. Est cupiditate minus enim ullam. Incidunt consequuntur id voluptatem ut. Veniam veniam quibusdam laborum mollitia quo nemo minima dolor.',1110),(2,'Ducimus laudantium eum aperiam eos qui voluptatem. Voluptatem nemo aliquam ullam corrupti molestiae. Voluptatem eum sed qui quae.',1111),(3,'Aspernatur fuga hic aspernatur in veritatis qui culpa. Fugiat qui et illum maiores dolorem vitae officia. Quis voluptate aliquam consectetur non harum cum distinctio ut.',1145),(4,'Perferendis saepe dolores qui dicta quos eum rem ratione. Voluptatem exercitationem doloribus provident magnam. Ex assumenda eius reprehenderit repellat velit dolorum.',1161),(5,'Voluptas tenetur et sunt cum. Et eligendi dignissimos possimus. Aspernatur sunt consequatur consequatur fugit consequuntur.',1270),(6,'Recusandae iure expedita eum. Harum assumenda et magnam aut. Inventore nostrum alias deserunt laudantium.',1271),(7,'Repudiandae explicabo quia ea et corrupti. Ex earum maxime quas ex tempora praesentium. Mollitia tempora excepturi error nisi quo.',1275),(8,'Eos sed omnis laudantium ratione qui aliquam modi. Sed placeat quaerat non doloribus. Deleniti et et id et hic praesentium.',1379),(9,'Et velit aut sequi unde et. Aut provident magnam quisquam odio. Aut quidem voluptates aut.',1403),(10,'Eaque exercitationem libero assumenda placeat suscipit. Aut facere quos magnam ipsum dignissimos. Necessitatibus omnis quibusdam qui aliquid iste.',1461);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `samples`
--

DROP TABLE IF EXISTS `samples`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `samples` (
  `sample_id` int NOT NULL,
  `eval` int DEFAULT NULL,
  `aliquots` int NOT NULL,
  `initial_storage_conditions` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `other_treatments` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `foil_wrapped` tinyint(1) NOT NULL,
  `unrestricted_consent` tinyint(1) NOT NULL,
  `notes` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `sub_study` tinyint(1) NOT NULL,
  `sub_study_name` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `date` date NOT NULL,
  `samples_key` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `hb` double DEFAULT NULL,
  `pb` double DEFAULT NULL,
  `density` double DEFAULT NULL,
  `type` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `bht` tinyint NOT NULL,
  `edta` tinyint NOT NULL,
  `heparin` tinyint NOT NULL,
  `mpa` tinyint NOT NULL,
  PRIMARY KEY (`samples_key`),
  UNIQUE KEY `sample_id` (`sample_id`),
  KEY `samples_fk0` (`user_id`),
  CONSTRAINT `samples_fk0` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `samples`
--

LOCK TABLES `samples` WRITE;
/*!40000 ALTER TABLE `samples` DISABLE KEYS */;
INSERT INTO `samples` VALUES (557,1,1,'Voluptatem delectus qui rem necessitatibus facilis adipisci. Non ullam beatae eos aperiam eum voluptatem assumenda magnam. Et libero libero error sequi saepe.','Perferendis consequuntur est quia sequi. Recusandae est corporis quas iusto placeat. Voluptatem repudiandae sunt aut est mollitia id.',1,1,'Quia et eaque maiores soluta maxime. Consequuntur facere dicta omnis expedita sint.',1,'dolorem','2001-08-18',1,1110,NULL,NULL,0.2942,'illo',1,1,0,1),(613,6,3,'Voluptatem et vel et debitis. Laudantium quod ut ullam quis architecto voluptatem. Omnis ut molestiae molestiae aut sunt qui eos. Illum ratione qui enim incidunt nisi doloribus.','Vitae neque facilis molestiae qui magnam. Voluptates aut ex qui eius itaque. Repellat esse sed corporis sit.',0,0,'Beatae voluptates incidunt et pariatur ullam fugiat. Asperiores veritatis aut quidem eos ut maiores fuga quia. Incidunt perferendis qui id necessitatibus qui aut iste. Maiores magni ut tenetur perspiciatis deserunt non.',0,'et','2018-11-18',2,1111,NULL,NULL,1.7696,'nesciunt',1,0,1,1),(661,7,0,'Tenetur qui alias debitis minus pariatur harum velit. Qui voluptas ipsa qui nihil. Asperiores sit magni beatae.\nOdio nostrum doloribus dolorem accusantium eius. Sit minima aut qui molestias saepe.','Ea eos ea nihil magnam neque nostrum et sit. Laudantium quia assumenda molestias et dolorum mollitia sint. Unde deserunt asperiores ut in a omnis laudantium.',1,1,'Aut voluptas ratione omnis et animi voluptatibus. Ipsum modi ut cupiditate rerum. Et aut debitis alias consequatur illo libero. Necessitatibus eveniet dolores minus omnis voluptas.',0,'sint','2003-09-09',3,1145,NULL,NULL,1.9569,'exercitationem',1,0,1,1),(575,0,6,'Magni consectetur neque laboriosam sint. Harum non nemo officiis. Quidem voluptatem eum iste et. Rerum dolor quia non repudiandae magni quis quibusdam quos.','Ut nesciunt nobis magni cumque ea sunt. Blanditiis nam saepe possimus vel ducimus accusamus. Optio voluptatum consequuntur doloribus quae.',0,0,'Quas et officiis ut id nam debitis. Rerum quia nihil error rerum et. Omnis tempore earum quaerat aut et magnam consequuntur.',0,'velit','1982-03-01',4,1161,NULL,NULL,1.6767,'maxime',0,0,1,1),(649,7,6,'Eum voluptate vitae recusandae quia. Veniam et eius ducimus quos et consequatur. Consequatur modi non ea minus.','Accusantium omnis porro ex est asperiores quod. Ipsam veritatis quaerat ratione tenetur exercitationem sed quas doloribus. Quis mollitia molestiae consequuntur sunt quos.',1,1,'Quia aliquid aspernatur quos beatae tempora et illo. Quam repellat quam officia est cupiditate. Et perspiciatis dolore molestiae pariatur.',1,'in','2011-06-05',5,1270,NULL,NULL,0.5686,'quos',0,1,1,0),(578,2,4,'Rerum debitis explicabo sunt soluta. Non nulla minima molestiae neque et illum dolorum. Voluptatem vel id quos non deleniti. Aliquid cupiditate rerum eum sint.','Sequi deleniti qui at quaerat nihil dolorum dicta. Magnam id voluptas velit quis ipsum. Eveniet impedit nisi nihil quaerat molestiae. Deleniti similique cum sapiente officiis repellat.',1,1,'Dolores et alias ipsa est repudiandae sequi est. Voluptatem vel quo aperiam. Assumenda dolores perspiciatis repudiandae harum debitis deleniti est. Tenetur quibusdam voluptas ad quia distinctio pariatur.',1,'quo','1976-08-25',6,1271,NULL,NULL,0.2249,'est',1,1,1,0),(543,6,0,'Est omnis temporibus reprehenderit numquam. Repellat voluptatem error sit aut occaecati quae. Iste aut facilis nulla molestiae.','Quaerat mollitia ex eligendi odit ipsam dolores aut. Perspiciatis laudantium veritatis ducimus optio ad esse sit.',0,0,'Fugiat magnam maxime ut nesciunt magni. Natus nisi sed et dolorem assumenda.',1,'rem','2020-01-30',7,1275,NULL,NULL,0.4714,'expedita',0,1,1,0),(615,8,6,'Alias aut ex minima ea unde ducimus. Consectetur excepturi et sed aut eius. Ipsum molestias facilis qui fuga. Iure esse eveniet deleniti.','Totam officia qui a adipisci placeat. Dignissimos sapiente molestiae ullam. Dolorem sequi necessitatibus dolorum earum.',1,1,'Maxime minus tempore architecto veritatis. Eaque quibusdam rerum corrupti eum nemo. Assumenda nihil aspernatur quo consequatur.',0,'quo','1990-06-19',8,1379,NULL,NULL,1.298,'et',1,1,1,1),(767,5,8,'Nam et velit nulla soluta ut. Pariatur vel voluptas dolor omnis eos. Quia blanditiis dolorem id voluptatum voluptatem dolores adipisci.','Ipsam eum velit recusandae ex voluptatibus. Ad aut consequatur sunt officiis quia enim officiis. Qui a officia est voluptatem et. Voluptatem amet nobis et corrupti.',1,1,'Consequuntur culpa omnis libero cum aut porro. Quisquam officiis non et voluptatem voluptatum natus fugit sed. Aut fuga perspiciatis ut voluptas ex aut.',1,'sed','1990-02-21',9,1403,NULL,NULL,1.73,'est',0,1,1,1),(773,9,1,'Excepturi autem odio aliquid. Pariatur doloribus dignissimos asperiores iure. Voluptas hic delectus est nihil. Qui nihil iusto dolor illum tempora. Soluta debitis unde debitis vel iure.','Iste explicabo aliquam facilis vitae vero laboriosam assumenda. Quibusdam qui non facere rerum vel. Et debitis animi qui et aliquid esse.',1,0,'Sit amet aut soluta animi quo atque aut. Perspiciatis dolorem et cum. Dolor odio earum at aperiam voluptatem.',1,'nihil','2010-07-30',10,1461,NULL,NULL,1.953,'ea',0,1,0,1);
/*!40000 ALTER TABLE `samples` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipments`
--

DROP TABLE IF EXISTS `shipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipments` (
  `shipment_id` int NOT NULL AUTO_INCREMENT,
  `from_location_id` int NOT NULL,
  `to_location_id` int NOT NULL,
  `shipment_date` date NOT NULL,
  `reached` tinyint(1) NOT NULL,
  `shipping_conditions` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `no_of_samples` int NOT NULL,
  `shipping_company` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `notes` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`shipment_id`),
  KEY `shipments_fk0` (`from_location_id`),
  KEY `shipments_fk1` (`to_location_id`),
  KEY `shipments_fk2` (`user_id`),
  CONSTRAINT `shipments_fk0` FOREIGN KEY (`from_location_id`) REFERENCES `locations` (`location_id`),
  CONSTRAINT `shipments_fk1` FOREIGN KEY (`to_location_id`) REFERENCES `locations` (`location_id`),
  CONSTRAINT `shipments_fk2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipments`
--

LOCK TABLES `shipments` WRITE;
/*!40000 ALTER TABLE `shipments` DISABLE KEYS */;
INSERT INTO `shipments` VALUES (1,1,1,'1975-04-02',1,'22.04',8,'Nikolaus Ltd','Alias atque quisquam iusto consequatur laboriosam. Odio qui quae consequatur aliquid. Quia atque consequuntur sit.',1110),(2,2,2,'1993-07-22',1,'2.3',8,'Corkery-Ziemann','Eveniet dicta iste ut sunt praesentium amet. At quis sunt et fuga dolorum. Recusandae nobis laborum consequatur. Voluptas dignissimos qui eaque rerum.',1111),(3,3,3,'1971-09-28',0,'59914388.105238',2,'Larson Group','Alias ab libero officia sed. Ab omnis odit nobis quasi. Qui eaque voluptas fugiat consequuntur harum vitae voluptatum. Deleniti libero consequatur enim qui.',1145),(4,4,4,'2020-10-10',0,'58088099.47131',5,'Lebsack PLC','Natus omnis unde laboriosam doloremque voluptatem harum deserunt animi. Aut sed et et ut ad nobis. Libero placeat ad molestiae porro reiciendis.',1161),(5,5,5,'1990-12-31',1,'19',5,'Kerluke and Sons','Saepe in officiis incidunt ipsa illo illum nisi. Dolorum mollitia ea est deserunt. Vitae ut dignissimos quisquam corrupti soluta dolores.',1270),(6,6,6,'1992-12-09',0,'4.21535357',3,'Reinger, O\'Keefe and Gutkowski','Voluptatem sint repudiandae nesciunt cumque rem ipsa reiciendis aliquam. Rerum quidem suscipit vero vero ullam. Et est reiciendis eligendi sit consequatur est. Aut iste eos qui aut.',1271),(7,7,7,'2005-09-23',0,'10639447.576005',8,'Ledner-Kassulke','Explicabo dolorum eum recusandae quia neque. Maxime ipsam sit sit dolorem non esse dolorum. Autem corporis fuga repudiandae optio eius eum quia.',1275),(8,8,8,'1983-07-23',0,'32796.935',0,'Quigley PLC','At quo laborum consequuntur eligendi. Fugiat et minima omnis blanditiis nulla et. Aut eos debitis magni itaque velit. Voluptatem voluptatem earum nobis placeat.',1379),(9,9,9,'1973-07-15',1,'37763.273',4,'Jacobi PLC','Fuga consequatur minima laboriosam. Ipsa hic necessitatibus autem explicabo. Similique exercitationem corporis exercitationem quod delectus sit aspernatur. Ut ipsa quibusdam non laboriosam fugiat itaque.',1403),(10,10,10,'1978-04-07',1,'2554.42',6,'DuBuque-Gottlieb','Doloremque sapiente sint debitis sit deserunt sit corrupti. Ea ut in facere et autem esse itaque. Iusto maxime minus animi eaque. Excepturi minus esse sunt odio.',1461);
/*!40000 ALTER TABLE `shipments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statuses` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `status_name` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statuses`
--

LOCK TABLES `statuses` WRITE;
/*!40000 ALTER TABLE `statuses` DISABLE KEYS */;
INSERT INTO `statuses` VALUES (1,'velit'),(2,'dolores'),(3,'eveniet'),(4,'voluptatem'),(5,'consequuntur'),(6,'velit'),(7,'unde'),(8,'modi'),(9,'eos'),(10,'aperiam');
/*!40000 ALTER TABLE `statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_history`
--

DROP TABLE IF EXISTS `transaction_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_history` (
  `transaction_id` int NOT NULL,
  `user_id` int NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `desciption` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `transaction_history_fk0` (`user_id`),
  CONSTRAINT `transaction_history_fk0` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_history`
--

LOCK TABLES `transaction_history` WRITE;
/*!40000 ALTER TABLE `transaction_history` DISABLE KEYS */;
INSERT INTO `transaction_history` VALUES (4856449,1403,'1998-07-16 13:00:16','Qui fugiat quis distinctio dolores reprehenderit recusandae. Autem est exercitationem rerum architecto.'),(4946370,1145,'1982-11-19 08:54:01','Quisquam similique molestiae magnam iste tempore. Sunt est et molestias qui nihil ab. Laboriosam molestiae qui ipsam consequatur est ut tempore.'),(5246216,1275,'1974-04-17 21:43:25','Et veniam non unde natus. Est aliquid accusantium voluptas voluptatem iusto aut.'),(5277959,1110,'2009-06-02 06:56:31','Quo inventore beatae ullam et omnis. Ratione blanditiis ea soluta rerum dolorem.\nIusto a qui quibusdam iste tempore sunt quis. Quo ut reprehenderit ipsam rerum ut. Et laudantium ut quaerat explicabo.'),(5292416,1461,'2015-04-27 10:25:33','Quis eos esse earum cupiditate. Vel asperiores voluptatem porro suscipit excepturi labore quod officiis. Tempora quisquam nihil sequi recusandae nesciunt.'),(5330004,1161,'2000-05-17 13:15:56','Voluptatem sit nobis dolorem sunt voluptatum commodi. Et maiores dolorem est porro qui alias sapiente. Architecto magni consequatur quisquam.'),(5567826,1111,'1972-04-13 06:49:26','Quae laboriosam totam distinctio unde quia consequatur libero. Illum sint rem minus eos ipsa quam quas. Voluptatum reiciendis temporibus et. Commodi adipisci aut est rem unde. Earum ab labore ut.'),(5731615,1271,'2014-01-06 18:20:21','Qui voluptas et dolor facere. Delectus quia amet suscipit autem. Itaque in iure sint cupiditate architecto ipsum deleniti.'),(5782633,1270,'1981-04-19 07:38:59','Sit doloremque et voluptatum voluptatibus. Ducimus voluptatem deserunt rerum ab ullam.'),(5937084,1379,'1972-04-12 04:52:18','Ratione molestias consequuntur doloribus vel excepturi eos. Velit est id quia numquam. Rerum consectetur ipsum non enim sint. Dolorem praesentium aut itaque ut incidunt atque quod.');
/*!40000 ALTER TABLE `transaction_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `email_id` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `timeout` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `resetlink` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1110,'preston74@gmail.com','8104ba1dc0409b259f487ed07db477c38f205a30',0,'',''),(1111,'crystel58@hotmail.com','007f7b428dbbdd903f061fc0c5db106a0c021d72',1,NULL,NULL),(1145,'maximillia.schmeler@yahoo.com','6bda1088f9bb49d97a99dfec3a25e0d2c0c8b246',0,NULL,NULL),(1161,'whammes@gmail.com','b188c75f56da9dd3d02f42d22674b827d2bf3ab6',0,NULL,NULL),(1270,'andreanne70@yahoo.com','fbb7ca59162c3dab9741b47710423ad972a238b1',0,NULL,NULL),(1271,'lubowitz.precious@gmail.com','286f62542403d7b4a21e0455e778c76a33fc6cb2',1,NULL,NULL),(1275,'glenna.lueilwitz@yahoo.com','a714c8a708e1cd4164dee2c3f049e498b3e52ac7',1,NULL,NULL),(1379,'wkuvalis@hotmail.com','101c8b705f21c4e95d822b9c729556846cfd6f2a',0,NULL,NULL),(1403,'germaine59@hotmail.com','805b4a0bfd17ab7c117752d21b8b9881e4a2e3df',0,NULL,NULL),(1420,'rohitkintali@gmail.com','7c222fb2927d828af22f592134e8932480637c0d',1,'6304520424','3469365934'),(1461,'smoen@hotmail.com','d1fa22fac0d0ac21a0895566cc5d4cfa811efb98',0,NULL,NULL);
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

-- Dump completed on 2020-10-21 14:45:39
