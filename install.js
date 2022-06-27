module.exports = async function init(conn) {
    try {
        await conn.query(`CREATE TABLE IF NOT EXISTS User (
            ID INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(45) NOT NULL,
            password VARCHAR(45) NOT NULL,
            birth DATE NULL,
            name VARCHAR(45) NOT NULL,
            address VARCHAR(45) NULL,
            avatar VARCHAR(45) ,
            banned TINYINT NOT NULL DEFAULT 0,
            PRIMARY KEY (ID, email));`) ;
        await conn.query(`
        CREATE TABLE IF NOT EXISTS Admin (
            ID INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(45) NOT NULL,
            password VARCHAR(45) NOT NULL,
            birth DATE NULL,
            name VARCHAR(45) NOT NULL,
            address VARCHAR(45) NULL,
            avatar VARCHAR(45),
            permissions VARCHAR(45) NOT NULL DEFAULT 0,
            PRIMARY KEY (ID, email))      
        `) ;
        await conn.query(`
        CREATE TABLE IF NOT EXISTS Film (
            ID INT NOT NULL AUTO_INCREMENT,
            type VARCHAR(45) NULL,
            name VARCHAR(45) NOT NULL,
            cover VARCHAR(45) NULL,
            genre VARCHAR(45) NOT NULL,
            description VARCHAR(245) NOT NULL,
            year DATE NOT NULL,
            content_rating VARCHAR(45) NOT NULL,
            company VARCHAR(45) NULL,
            date_published DATE NOT NULL,
            country VARCHAR(45) NOT NULL,
            average INT ,
            comment_count INT,
            PRIMARY KEY (ID))   
        `) ;
        await conn.query(` 
        CREATE TABLE IF NOT EXISTS Artists (
            ID INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(45) NOT NULL,
            avatar VARCHAR(45) NULL,
            bio VARCHAR(245) NULL,
            role VARCHAR(45) NULL,
            PRIMARY KEY (ID))
        `) ;
        await conn.query(`
        CREATE TABLE IF NOT EXISTS Admin_ban_User (
            Admin_ID INT NOT NULL,
            Admin_email VARCHAR(45) NOT NULL,
            User_ID INT NOT NULL,
            User_email VARCHAR(45) NOT NULL,
            PRIMARY KEY (Admin_ID, Admin_email, User_ID, User_email),
            CONSTRAINT fk_Admin_has_User_Admin1
              FOREIGN KEY (Admin_ID , Admin_email)
              REFERENCES Admin (ID , email)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT fk_Admin_has_User_User1
              FOREIGN KEY (User_ID , User_email)
              REFERENCES User (ID , email)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)       
        `) ;
        await conn.query(`
        CREATE TABLE IF NOT EXISTS Admin_Manage_Movie (
            Admin_ID INT NOT NULL,
            Admin_email VARCHAR(45) NOT NULL,
            Movie_ID INT NOT NULL,
            PRIMARY KEY (Admin_ID, Admin_email, Movie_ID),
              FOREIGN KEY (Admin_ID , Admin_email)
              REFERENCES imdb.Admin (ID , email)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT fk_Admin_has_Movie_Movie1
              FOREIGN KEY (Movie_ID)
              REFERENCES Film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)    
        `) ;
        await conn.query(`
        CREATE TABLE IF NOT EXISTS Comment (
            ID INT NOT NULL,
            User_ID INT NOT NULL,
            date DATE NOT NULL,
            text VARCHAR(245) NOT NULL,
            accepted TINYINT NOT NULL DEFAULT 0,
            PRIMARY KEY (ID, User_ID),
            INDEX fk_Comment_User_idx (User_ID ASC),
            CONSTRAINT fk_Comment_User
              FOREIGN KEY (User_ID)
              REFERENCES User (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)    
        `) ;
        await conn.query(` 
        CREATE TABLE IF NOT EXISTS Movie_Comments (
            Comment_ID INT NOT NULL,
            Comment_User_ID INT NOT NULL,
            Movie_ID INT NOT NULL,
            Approved_By INT NOT NULL,
            Admin_email VARCHAR(45) NOT NULL,
            PRIMARY KEY (Comment_ID, Comment_User_ID, Movie_ID),
            CONSTRAINT fk_Comment_has_Movie_Comment1
              FOREIGN KEY (Comment_ID , Comment_User_ID)
              REFERENCES Comment (ID , User_ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT fk_Comment_has_Movie_Movie1
              FOREIGN KEY (Movie_ID)
              REFERENCES Film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT fk_Movie_Comments_Admin1
              FOREIGN KEY (Approved_By , Admin_email)
              REFERENCES Admin (ID , email)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)
          ENGINE = InnoDB  
        `) ;

        await conn.query(`
        CREATE TABLE IF NOT EXISTS Stars (
            ID INT NOT NULL,
            Rating INT NOT NULL,
            User_ID INT NOT NULL,
            Movie_ID INT NOT NULL,
            PRIMARY KEY (ID, User_ID, Movie_ID),
            CONSTRAINT fk_Stars_User1
              FOREIGN KEY (User_ID)
              REFERENCES User (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT fk_Stars_Movie1
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
            CONSTRAINT fk_Awards_Movie1
              FOREIGN KEY (Movie_ID)
              REFERENCES Film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT fk_Awards_Artists1
              FOREIGN KEY (Artists_ID)
              REFERENCES Artists (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)  
        `) ;
        await conn.query(` 
        CREATE TABLE IF NOT EXISTS Movie_has_Artists (
            Movie_ID INT NOT NULL,
            Artists_ID INT NOT NULL,
            PRIMARY KEY (Movie_ID, Artists_ID),
            INDEX fk_Movie_has_Artists_Artists1_idx (Artists_ID ASC) ,
            INDEX fk_Movie_has_Artists_Movie1_idx (Movie_ID ASC) ,
            CONSTRAINT fk_Movie_has_Artists_Movie1
              FOREIGN KEY (Movie_ID)
              REFERENCES Film (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT fk_Movie_has_Artists_Artists1
              FOREIGN KEY (Artists_ID)
              REFERENCES Artists (ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION) 
        `) ;
        await conn.query(`
        CREATE TABLE IF NOT EXISTS Admin_approves_Comment (
            Admin_ID INT NOT NULL,
            Admin_email VARCHAR(45) NOT NULL,
            Comment_ID INT NOT NULL,
            Comment_User_ID INT NOT NULL,
            PRIMARY KEY (Admin_ID, Admin_email, Comment_ID, Comment_User_ID),
            CONSTRAINT fk_Admin_has_Comment_Admin1
              FOREIGN KEY (Admin_ID , Admin_email)
              REFERENCES Admin (ID , email)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION,
            CONSTRAINT fk_Admin_has_Comment_Comment1
              FOREIGN KEY (Comment_ID , Comment_User_ID)
              REFERENCES Comment (ID , User_ID)
              ON DELETE NO ACTION
              ON UPDATE NO ACTION)    
        `) ;
    } catch(err) {
        console.log(err)
    }

    
}
