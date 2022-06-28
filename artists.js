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
})

module.exports = router ;