-- Structure de la base de données JAMA3I

-- Table des mosquées (doit être créée en premier car référencée par GHTUSR)
CREATE TABLE GHTMOSQ (
    ms_id INT AUTO_INCREMENT PRIMARY KEY,
    ms_name VARCHAR(100) NOT NULL,
    ms_addr VARCHAR(255) NOT NULL,
    ms_city VARCHAR(100) NOT NULL,
    ms_latitude DECIMAL(10, 8),
    ms_longitude DECIMAL(11, 8),
    ms_phone VARCHAR(20),
    ms_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des utilisateurs
CREATE TABLE GHTUSR (
    us_id INT AUTO_INCREMENT PRIMARY KEY,
    us_fname VARCHAR(50) NOT NULL,
    us_lname VARCHAR(50) NOT NULL,
    us_gender ENUM('M', 'F') NOT NULL,
    us_bdate DATE NOT NULL,
    us_email VARCHAR(100) NOT NULL UNIQUE,
    us_phone VARCHAR(20),
    us_city VARCHAR(100),
    us_type ENUM('user', 'mosque_admin', 'admin') DEFAULT 'user',
    us_status ENUM('pending', 'active', 'blocked') DEFAULT 'pending',
    mosque_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mosque_id) REFERENCES GHTMOSQ(ms_id)
);

-- Table des événements
CREATE TABLE IF NOT EXISTS GHTEVT (
    ev_id INT PRIMARY KEY AUTO_INCREMENT,
    mosque_id INT,
    user_id INT,
    ev_title VARCHAR(255) NOT NULL,
    ev_desc TEXT,
    ev_type ENUM('course', 'donation', 'community_work') NOT NULL,
    ev_sdate DATETIME NOT NULL,
    ev_edate DATETIME NOT NULL,
    ev_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mosque_id) REFERENCES GHTMOSQ(ms_id),
    FOREIGN KEY (user_id) REFERENCES GHTUSR(us_id)
);

-- Table des participations aux événements
CREATE TABLE GHTPAR (
    pr_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    pr_amount DECIMAL(10, 2),
    pr_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES GHTEVT(ev_id),
    FOREIGN KEY (user_id) REFERENCES GHTUSR(us_id)
);

-- Table des vidéos
CREATE TABLE IF NOT EXISTS GHTVID (
    vd_id INT PRIMARY KEY AUTO_INCREMENT,
    vd_title VARCHAR(255) NOT NULL,
    vd_desc TEXT,
    vd_url VARCHAR(255) NOT NULL,
    vd_cate VARCHAR(50) NOT NULL,
    vd_subcate VARCHAR(50),
    vd_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des invocations
CREATE TABLE GHTINV (
    in_id INT AUTO_INCREMENT PRIMARY KEY,
    in_text_ar TEXT NOT NULL,
    in_text_fr TEXT NOT NULL,
    in_text_en TEXT,
    in_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des reçus de dons
CREATE TABLE GHTDON (
    dn_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    dn_amount DECIMAL(10, 2) NOT NULL,
    dn_receipt_num VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES GHTEVT(ev_id),
    FOREIGN KEY (user_id) REFERENCES GHTUSR(us_id)
); 