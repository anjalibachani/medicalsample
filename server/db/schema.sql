CREATE DATABASE IF NOT EXISTS medical_sample_db;
USE medical_sample_db;
CREATE TABLE IF NOT EXISTS `samples` (
	`sample_id` int NOT NULL UNIQUE,
	`eval` int(255),
	`aliquots` int(255) NOT NULL,
	`initial_storage_conditions` TEXT(255) NOT NULL,
	`other_treatments` TEXT(255) NOT NULL,
	`foil_wrapped` bool NOT NULL,
	`unrestricted_consent` bool NOT NULL,
	`notes` TEXT(255) NOT NULL,
	`sub_study` bool NOT NULL,
	`sub_study_name` TEXT,
	`date` DATE NOT NULL,
	`samples_key` int NOT NULL AUTO_INCREMENT,
	`user_id` int NOT NULL,
	`hb` double,
	`pb` double,
	`density` double,
	`type` TEXT NOT NULL,
	`bht` tinyint NOT NULL,
	`edta` tinyint NOT NULL,
	`heparin` tinyint NOT NULL,
	`mpa` tinyint NOT NULL,
	PRIMARY KEY (`samples_key`)
);

CREATE TABLE IF NOT EXISTS `aliquots` (
	`aliquot_id` int NOT NULL AUTO_INCREMENT,
	`sample_id` int NOT NULL,
	`location_id` int NOT NULL,
	`status_id` int NOT NULL,
	`freezer_id` int,
	PRIMARY KEY (`aliquot_id`)
);

CREATE TABLE IF NOT EXISTS `locations` (
	`location_id` int NOT NULL AUTO_INCREMENT,
	`location_name` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	PRIMARY KEY (`location_id`)
);

CREATE TABLE IF NOT EXISTS `shipments` (
	`shipment_id` int NOT NULL AUTO_INCREMENT,
	`from_location_id` int(255) NOT NULL,
	`to_location_id` int(255) NOT NULL,
	`shipment_date` DATE NOT NULL,
	`reached` bool NOT NULL,
	`shipping_conditions` varchar(255),
	`no_of_samples` int(255) NOT NULL,
	`shipping_company` varchar(255),
	`notes` varchar(255),
	`user_id` int NOT NULL,
	PRIMARY KEY (`shipment_id`)
);

CREATE TABLE IF NOT EXISTS `location_history` (
	`aliquot_id` int NOT NULL,
	`sample_id` int NOT NULL,
	`shipment_id` int NOT NULL,
	`location_history_id` int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`location_history_id`)
);

CREATE TABLE IF NOT EXISTS `users` (
	`user_id` int(11) NOT NULL,
	`email_id` text NOT NULL,
	 `password` varchar(255) NOT NULL,
	 `admin` tinyint(1) NOT NULL,
	PRIMARY KEY (`user_id`)
);

CREATE TABLE IF NOT EXISTS `freezers` (
	`freezer_id` int NOT NULL AUTO_INCREMENT,
	`lab_name` TEXT NOT NULL,
	`storage_temp` TEXT NOT NULL,
	PRIMARY KEY (`freezer_id`)
);

CREATE TABLE IF NOT EXISTS `statuses` (
	`status_id` int NOT NULL AUTO_INCREMENT,
	`status_name` TEXT NOT NULL,
	PRIMARY KEY (`status_id`)
);

CREATE TABLE IF NOT EXISTS `transaction_history` (
	`transaction_id` int NOT NULL AUTO_INCREMENT,
	`user_id` int NOT NULL,
	`timestamp` TIMESTAMP NOT NULL,
	`desciption` TEXT NOT NULL,
	PRIMARY KEY (`transaction_id`)
);

ALTER TABLE `samples` ADD CONSTRAINT `samples_fk0` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`);

ALTER TABLE `aliquots` ADD CONSTRAINT `aliquots_fk0` FOREIGN KEY (`sample_id`) REFERENCES `samples`(`sample_id`);

ALTER TABLE `aliquots` ADD CONSTRAINT `aliquots_fk1` FOREIGN KEY (`location_id`) REFERENCES `locations`(`location_id`);

ALTER TABLE `aliquots` ADD CONSTRAINT `aliquots_fk2` FOREIGN KEY (`status_id`) REFERENCES `statuses`(`status_id`);

ALTER TABLE `aliquots` ADD CONSTRAINT `aliquots_fk3` FOREIGN KEY (`freezer_id`) REFERENCES `freezers`(`freezer_id`);

ALTER TABLE `locations` ADD CONSTRAINT `locations_fk0` FOREIGN KEY (`user_id`) REFERENCES `aliquots`(`aliquot_id`);

ALTER TABLE `shipments` ADD CONSTRAINT `shipments_fk0` FOREIGN KEY (`from_location_id`) REFERENCES `locations`(`location_id`);

ALTER TABLE `shipments` ADD CONSTRAINT `shipments_fk1` FOREIGN KEY (`to_location_id`) REFERENCES `locations`(`location_id`);

ALTER TABLE `shipments` ADD CONSTRAINT `shipments_fk2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`);

ALTER TABLE `location_history` ADD CONSTRAINT `location_history_fk0` FOREIGN KEY (`aliquot_id`) REFERENCES `aliquots`(`aliquot_id`);

ALTER TABLE `location_history` ADD CONSTRAINT `location_history_fk1` FOREIGN KEY (`sample_id`) REFERENCES `aliquots`(`sample_id`);

ALTER TABLE `location_history` ADD CONSTRAINT `location_history_fk2` FOREIGN KEY (`shipment_id`) REFERENCES `shipments`(`shipment_id`);

ALTER TABLE `transaction_history` ADD CONSTRAINT `transaction_history_fk0` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`);

