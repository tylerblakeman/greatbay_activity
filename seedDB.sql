DROP DATABASE IF EXISTS Great_BayDB;

CREATE DATABASE Great_BayDB;

USE Great_BayDB;

CREATE TABLE auction (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  category VARCHAR(45) NOT NULL,
  descrip VARCHAR(45) NOT NULL,
  reserve INT NOT NULL,
  highestBid INT NULL,
  PRIMARY KEY (id)
);
INSERT INTO auction (title, category, descrip, reserve, highestBid)
VALUES ("Car", "Vehicles", "POS", 5000, 5000);