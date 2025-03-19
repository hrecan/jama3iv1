-- Créer l'utilisateur Admin s'il n'existe pas
CREATE USER IF NOT EXISTS 'Admin'@'localhost' IDENTIFIED BY 'Asmarh06072024*';

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS jama3iv001;

-- Donner tous les privilèges à l'utilisateur Admin sur la base de données jama3iv001
GRANT ALL PRIVILEGES ON jama3iv001.* TO 'Admin'@'localhost';

-- Appliquer les changements
FLUSH PRIVILEGES;
