const mysql = require("mysql2/promise");
require("dotenv").config();
async function init() {
  const conn = await mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
  });
  try {
    await conn.query(`CREATE TABLE IF NOT EXISTS user (
            ID INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(45) NOT NULL UNIQUE,
            password VARCHAR(254) NOT NULL,
            username VARCHAR(45) NOT NULL UNIQUE,
            name VARCHAR(45) NOT NULL,
            avatar VARCHAR(45) ,
            banned TINYINT NOT NULL DEFAULT 0,
            PRIMARY KEY (ID));`);
    await conn.query(`
        CREATE TABLE IF NOT EXISTS admin (
            ID INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(45) NOT NULL UNIQUE,
            password VARCHAR(254) NOT NULL,
            name VARCHAR(45) NOT NULL,
            avatar VARCHAR(45),
            PRIMARY KEY (ID))      
        `);
    await conn.query(`
        CREATE TABLE IF NOT EXISTS film (
            ID INT NOT NULL AUTO_INCREMENT,
            type VARCHAR(45) NULL,
            name VARCHAR(45) NOT NULL,
            cover VARCHAR(254) NULL,
            genre VARCHAR(45) NOT NULL,
            description VARCHAR(245) NOT NULL,
            year INT NOT NULL,
            content_rating VARCHAR(45) NOT NULL,
            company VARCHAR(45) NULL,
            date_published DATE NOT NULL,
            country VARCHAR(45) NOT NULL,
            average FLOAT NOT NULL DEFAULT 0 ,
            comment_count INT NOT NULL DEFAULT 0,
            PRIMARY KEY (ID))   
        `);
    await conn.query(` 
        CREATE TABLE IF NOT EXISTS artists (
            ID INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(45) NOT NULL,
            avatar VARCHAR(255) NULL,
            bio VARCHAR(245) NULL,
            role VARCHAR(45) NULL,
            award_count INT NOT NULL DEFAULT 0,
            PRIMARY KEY (ID))
        `);
    await conn.query(`
        CREATE TABLE IF NOT EXISTS comment (
            ID INT NOT NULL AUTO_INCREMENT,
            User_ID INT NOT NULL,
            Movie_ID INT NOT NULL,
            date DATE NOT NULL,
            text VARCHAR(245) NOT NULL,
            accepted TINYINT NOT NULL DEFAULT 9,
            PRIMARY KEY (ID, User_ID , Movie_ID),
              FOREIGN KEY (User_ID)
              REFERENCES user (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION , 
              FOREIGN KEY (Movie_ID)
              REFERENCES film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION
        )    
        `);

    await conn.query(`
        CREATE TABLE IF NOT EXISTS stars (
            ID INT NOT NULL AUTO_INCREMENT,
            Rating INT NOT NULL,
            User_ID INT NOT NULL,
            Movie_ID INT NOT NULL,
            PRIMARY KEY (ID, User_ID, Movie_ID),
              FOREIGN KEY (User_ID)
              REFERENCES user (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
              FOREIGN KEY (Movie_ID)
              REFERENCES film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)   
        `);
    await conn.query(` 
        CREATE TABLE IF NOT EXISTS awards (
            ID INT NOT NULL AUTO_INCREMENT,
            Name VARCHAR(45) NOT NULL,
            Date DATE NULL,
            Description VARCHAR(45) NULL,
            Movie_ID INT  NULL,
            Artists_ID INT NULL,
            PRIMARY KEY (ID),
              FOREIGN KEY (Movie_ID)
              REFERENCES film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
              FOREIGN KEY (Artists_ID)
              REFERENCES artists (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)  
        `);
    await conn.query(` 
        CREATE TABLE IF NOT EXISTS Movie_has_Artists (
            Movie_ID INT NOT NULL,
            Artists_ID INT NOT NULL,
            Description VARCHAR(45) NULL,
            PRIMARY KEY (Movie_ID, Artists_ID),
              FOREIGN KEY (Movie_ID)
              REFERENCES film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
              FOREIGN KEY (Artists_ID)
              REFERENCES artists (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION) 
        `);
    await conn.query(`
        CREATE TRIGGER IF NOT EXISTS Update_filme_rating AFTER INSERT ON stars FOR
        EACH ROW UPDATE film SET average=(SELECT AVG(Rating) AS AVERAGE FROM stars 
        WHERE film.ID=stars.Movie_ID)
        `);
    await conn.query(`
        CREATE TRIGGER IF NOT EXISTS Update_filme_rating2 AFTER UPDATE ON stars FOR
        EACH ROW UPDATE film SET average=(SELECT AVG(Rating) AS AVERAGE FROM stars 
        WHERE film.ID=stars.Movie_ID)
        `);
    await conn.query(`
        CREATE TRIGGER IF NOT EXISTS Update_filme_rating3 AFTER DELETE ON stars FOR
        EACH ROW UPDATE film SET average=(SELECT AVG(Rating) AS AVERAGE FROM stars 
        WHERE film.ID=stars.Movie_ID)
        `);
    await conn.query(`CREATE TRIGGER  IF NOT EXISTS COMMENT_COUNT AFTER UPDATE 
        ON comment FOR EACH ROW UPDATE film SET comment_count=(SELECT COUNT(comment
        .Movie_ID) FROM comment WHERE film.ID=comment.Movie_ID AND accepted=1)
        `);
    await conn.query(`CREATE TRIGGER  IF NOT EXISTS COMMENT_COUNT1 AFTER DELETE 
        ON comment FOR EACH ROW UPDATE film SET comment_count=(SELECT COUNT(comment
        .Movie_ID) FROM comment WHERE film.ID=comment.Movie_ID AND accepted=1)
        `);
    await conn.query(`CREATE TRIGGER  IF NOT EXISTS AWARD_COUNT AFTER UPDATE 
        ON awards FOR EACH ROW UPDATE artists SET  award_count=(SELECT COUNT(awards
        .Artists_ID) FROM awards WHERE artists.ID=awards.Artists_ID)
        `);
    await conn.query(`CREATE TRIGGER  IF NOT EXISTS AWARD_COUNT1 AFTER DELETE 
        ON awards FOR EACH ROW UPDATE artists SET award_count=(SELECT COUNT(awards
        .Artists_ID) FROM awards WHERE artists.ID=awards.Artists_ID)
        `);
    await conn.query(
      "INSERT IGNORE INTO `admin` (`ID`, `email`, `password`, `name`, `avatar`) VALUES (1, 'admin@example.com', 'password', 'admin', NULL);"
    );
    conn.end();
  } catch (err) {
    console.log(err);
    conn.end();
  }
}
init();
