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
    //res.send("artists")
    // #get all x artist
    conn.query(`SELECT * FROM artists`,(err,result,field)=>{
        if(err){
            console.log(err)
        } else{
            console.log(result)
            res.send('selected successfully')
        }
    })
})

router.get("/:id" , (req , res) => {
    // get info about artist with id + get all videos artists attended.
    const id = req.params.id ;
    conn.query("SELECT * FROM artists WHERE ID = ? " , [id] ,  (error , result) => {
        if(error){
            console.log(error)
        }else{
             conn.query("SELECT SELECT Movie_ID FROM movie_has_artists WHERE Artists_ID= ?" , [id] , (error2 , result2) => {
                 if(error2){
                     console.log(error2)
                 }else{
                    console.log(result);
                     console.log(result2);
                     res.send('selected successfully')
                 }    
               
             })
        }
    })
})

module.exports = router ;