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
    const p = Number.parseInt(req.query.p) || 0;
    const offset = p * 20 || 0 ; 
    const name = req.query.CelebrityName
    const role = req.query.CelebrityRole
    const queryobj = getSearchQuery(name,role,offset)
    const queryobj2= getSearchQuery2(name,role,offset)
    //console.log(queryobj)
    conn.query(queryobj.query,queryobj.items,(err,result,field)=>{
        conn.query(queryobj2.query,queryobj2.items,(err2,result2)=>{

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
    conn.query("SELECT * FROM artists WHERE ID=? " , [id] ,  (error , result) => {
        if(error){
            console.log(error)
        }else{
            //console.log(result[0])
             conn.query("SELECT COUNT(Movie_ID) AS COUNTM FROM movie_has_artists WHERE Artists_ID= ?" , [id] , (error2 , result2) => {
                 if(error2){
                     console.log(error2)
                 }else{
                    conn.query(`SELECT name , genre , date_published , cover FROM film WHERE ID IN (SELECT Movie_ID AS COUNTM FROM movie_has_artists WHERE Artists_ID=? )`,[id],(err3,result3)=>{
                        if(err3){
                            console.log(err3)
                        } else{
                            conn.query(`SELECT Name ,Date ,Description  FROM awards  WHERE ArtistS_ID=?  `,[id],(err4,result4)=>{
                                if(err4){
                                    console.log(err4)
                                } else{
                                    conn.query(`SELECT COUNT(ID) AS CORE  FROM awards  WHERE  ArtistS_ID=?  `,[id],(err5,result5)=>{
                                        if(err5){
                                            console.log(err5)
                                        } else{
                                            res.render("index/singleArtist", { artist : result[0] , allvideo : result2[0].COUNTM , videos : result3 , awards:result4 , countre:result5[0].CORE})

                                        }
                                    })

                                }

                            })
                          
                        }
                    })

                
                 }    
               
             })
        }
    })
})



function getSearchQuery(name,role, offset){
    let query = "SELECT * FROM artists "
    const items = [{item : ["name" , name]} , {item : ["role" , role]}] ; 

    const result = items.filter((current) => {
        return current.item[1]
    })
    let resultItems = [] ;
    if (result.length > 0) {
        query += "WHERE "
        result.forEach(object => {
          if (object.item[0] == "role") {
                query += "role=? AND " ;
                resultItems.push(object.item[1])
            } else{
                query += object.item[0] + " LIKE ? AND "
                resultItems.push(object.item[1] + "%")
            }
        })
        query += "1 " ;
    }
    query += "LIMIT 20 OFFSET ?"
    resultItems.push(offset)

    return {query : query , items : resultItems};
}
function getSearchQuery2(name,role, offset){
    let query = "SELECT COUNT(ID) AS Count FROM artists "
    const items = [{item : ["name" , name]} , {item : ["role" , role]}] ; 

    const result = items.filter((current) => {
        return current.item[1]
    })
    let resultItems = [] ;
    if (result.length > 0) {
        query += "WHERE "
        result.forEach(object => {
          if (object.item[0] == "role") {
                query += "role=? AND " ;
                resultItems.push(object.item[1])
            } else{
                query += object.item[0] + " LIKE ? AND "
                resultItems.push(object.item[1] + "%")
            }
        })
        query += "1 " ;
    }
    query += "LIMIT 20 OFFSET ?"
    resultItems.push(offset)

    return {query : query , items : resultItems};
}




module.exports = router 