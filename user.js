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
    const id =req.session.id
    conn.query(`SELECT * FROM user WHERE ID=?`,[id],(err,result,field)=>{
        if(err){
            console.log(err)
        } else {
            console.log(result)
        }
    })
})
router.put("/profile" , (req , res) => {
    // update user profile
    
})

module.exports = router ;