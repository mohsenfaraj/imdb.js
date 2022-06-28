const express = require("express")
const router = express.Router()
const mysql = require("mysql2") ;
const conn = mysql.createConnection({
    host : process.env.DBHOST , 
    user : process.env.DBUSER ,
    password : process.env.DBPASS ,
    database : process.env.DBNAME
})
router.get("/profile" , (req , res) => {
    res.send("profile");
    // get all info about user profile
})
router.post("/profile" , (req , res) => {
    // update user profile
})

module.exports = router ;