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
    const p = req.query.p || 0;
    const offset = p * 20 || 0 ; 
    conn.query(`SELECT * FROM artists LIMIT 2 OFFSET ?`,[offset],(err,result,field)=>{
        conn.query(`SELECT COUNT(ID) AS Count FROM artists`,(err2,result2)=>{

            if(err || err2){
                console.log(err)
                console.log(err2)
            } else{
            //console.log(result)
            //res.send('selected successfully')
            res.render("index/allArtists" , {Message:"ARTIST LIST", artists : result , count_artists : result2[0].Count , p:p })
            }       
        })
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

module.exports = router 