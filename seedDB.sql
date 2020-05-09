DROP DATABASE IF EXISTS Great_BayDB;

CREATE DATABASE Great_BayDB;

USE Great_BayDB;

CREATE TABLE auction (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  descrip VARCHAR(45) NOT NULL,
  reserve INT NOT NULL,
  highestBid INT NULL,
  PRIMARY KEY (id)
);
INSERT INTO auction (title, category, startingBid, highestBid)
VALUES ("Car", "Vehicles", 5000, 5000);