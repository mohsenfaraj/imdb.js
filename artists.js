const express = require("express")
const router = express.Router()
const mysql = require("mysql2") ;
const conn = mysql.createConnection({
    host : process.env.DBHOST , 
    user : process.env.DBUSER ,
    password : process.env.DBPASS ,
    database : process.env.DBNAME
})

router.get("/" , (req , res) => {
    res.send("artists")
    // #get all x artist 
})

router.get("/:id" , (req , res) => {
    // get info about artist with id + get all videos artists attended.
    const id = req.params.id ;
    conn.query("SELECT * FROM artists WHERE id = ? " , [id] ,  (error , result) => {
        conn.query("SELECT Movie_ID from movie_has_artists where id = ?" , [id] , (error2 , result2) => {
            console.log(result);

        })
    })
})

module.exports = router ;