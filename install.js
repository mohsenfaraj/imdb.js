module.exports = async function init(conn) {
    try {
        await conn.query(`CREATE TABLE IF NOT EXISTS User (
            ID INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(45) NOT NULL UNIQUE,
            password VARCHAR(254) NOT NULL,
            user_name VARCHAR(45) NOT NULL UNIQUE,
            name VARCHAR(45) NOT NULL,
            avatar VARCHAR(45) ,
            banned TINYINT NOT NULL DEFAULT 0,
            PRIMARY KEY (ID));`) ;
        await conn.query(`
        CREATE TABLE IF NOT EXISTS Admin (
            ID INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(45) NOT NULL UNIQUE,
            password VARCHAR(254) NOT NULL,
            name VARCHAR(45) NOT NULL,
            avatar VARCHAR(45),
            PRIMARY KEY (ID))      
        `) ;
        await conn.query(`
        CREATE TABLE IF NOT EXISTS Film (
            ID INT NOT NULL AUTO_INCREMENT,
            type VARCHAR(45) NULL,
            name VARCHAR(45) NOT NULL,
            cover VARCHAR(254) NULL,
            genre VARCHAR(45) NOT NULL,
            description VARCHAR(245) NOT NULL,
            year DATE NOT NULL,
            content_rating VARCHAR(45) NOT NULL,
            company VARCHAR(45) NULL,
            date_published DATE NOT NULL,
            country VARCHAR(45) NOT NULL,
            average FLOAT NOT NULL DEFAULT 0 ,
            comment_count INT,
            PRIMARY KEY (ID))   
        `) ;
        await conn.query(` 
        CREATE TABLE IF NOT EXISTS Artists (
            ID INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(45) NOT NULL,
            avatar VARCHAR(255) NULL,
            bio VARCHAR(245) NULL,
            role VARCHAR(45) NULL,
            PRIMARY KEY (ID))
        `) ;
        await conn.query(`
        CREATE TABLE IF NOT EXISTS Comment (
            ID INT NOT NULL,
            User_ID INT NOT NULL,
            Movie_ID INT NOT NULL,
            date DATE NOT NULL,
            text VARCHAR(245) NOT NULL,
            accepted TINYINT NOT NULL DEFAULT 9,
            PRIMARY KEY (ID, User_ID , Movie_ID),
              FOREIGN KEY (User_ID)
              REFERENCES User (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION , 
              FOREIGN KEY (Movie_ID)
              REFERENCES Film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION
        )    
        `) ;

        await conn.query(`
        CREATE TABLE IF NOT EXISTS Stars (
            ID INT NOT NULL,
            Rating INT NOT NULL,
            User_ID INT NOT NULL,
            Movie_ID INT NOT NULL,
            PRIMARY KEY (ID, User_ID, Movie_ID),
              FOREIGN KEY (User_ID)
              REFERENCES User (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
              FOREIGN KEY (Movie_ID)
              REFERENCES Film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)   
        `) ;
        await conn.query(` 
        CREATE TABLE IF NOT EXISTS Awards (
            ID INT NOT NULL,
            Name VARCHAR(45) NOT NULL,
            Date DATE NULL,
            Description VARCHAR(45) NULL,
            Movie_ID INT NOT NULL,
            Artists_ID INT NOT NULL,
            PRIMARY KEY (ID),
              FOREIGN KEY (Movie_ID)
              REFERENCES Film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
              FOREIGN KEY (Artists_ID)
              REFERENCES Artists (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)  
        `) ;
        await conn.query(` 
        CREATE TABLE IF NOT EXISTS Movie_has_Artists (
            Movie_ID INT NOT NULL,
            Artists_ID INT NOT NULL,
            Description VARCHAR(45) NULL,
            PRIMARY KEY (Movie_ID, Artists_ID),
              FOREIGN KEY (Movie_ID)
              REFERENCES Film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
              FOREIGN KEY (Artists_ID)
              REFERENCES Artists (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION) 
        `) ;
        await conn.query(`
        CREATE TRIGGER IF NOT EXISTS Update_filme_rating AFTER INSERT ON stars FOR
        EACH ROW UPDATE film SET average=(SELECT AVG(Rating) AS AVERAGE FROM stars 
        WHERE film.ID=stars.Movie_ID)
        `)
        await conn.query(`
        CREATE TRIGGER IF NOT EXISTS Update_filme_rating2 AFTER UPDATE ON stars FOR
        EACH ROW UPDATE film SET average=(SELECT AVG(Rating) AS AVERAGE FROM stars 
        WHERE film.ID=stars.Movie_ID)
        `)
        await conn.query(`
        CREATE TRIGGER IF NOT EXISTS Update_filme_rating3 AFTER DELETE ON stars FOR
        EACH ROW UPDATE film SET average=(SELECT AVG(Rating) AS AVERAGE FROM stars 
        WHERE film.ID=stars.Movie_ID)
        `)
        await conn.query(`CREATE TRIGGER  IF NOT EXISTS COMMENT_COUNT AFTER UPDATE 
        ON comment FOR EACH ROW UPDATE film SET comment_count=(SELECT COUNT(comment
        .Movie_ID) FROM comment WHERE film.ID=comment.Movie_ID AND accepted=1)
        `)
        await conn.query(`CREATE TRIGGER  IF NOT EXISTS COMMENT_COUNT1 AFTER DELETE 
        ON comment FOR EACH ROW UPDATE film SET comment_count=(SELECT COUNT(comment
        .Movie_ID) FROM comment WHERE film.ID=comment.Movie_ID AND accepted=1)
        `)
    } catch(err) {
        console.log(err)
    }

    
}
