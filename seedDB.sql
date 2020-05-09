DROP DATABASE IF EXISTS Great_BayDB;

CREATE DATABASE Great_BayDB;

USE Great_BayDB;

CREATE TABLE auction (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  category VARCHAR(45) NOT NULL,
  startingBid INT NOT NULL,
  highestBid INT NOT NULL,
  PRIMARY KEY (id)
);
INSERT INTO auction (title, category, startingBid, highestBid)
VALUES ("Car", "Vehicles", 5000, 5000);