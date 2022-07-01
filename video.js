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
    const p = Number.parseInt(req.query.p) || 0;
    const offset = p * 20 || 0 ; 
    const name = req.query.name ;
    const type = req.query.type ;
    const genre = req.query.genre ;
    const averageMin = req.query.averageMin ;
    const averageMax = req.query.averageMax ;
    const year = req.query.year ;

    const queryObj = getSearchQuery(name , type , genre , averageMin , averageMax , year , offset) ;
    const queryObj2 = getSearchQuery2(name , type , genre , averageMin , averageMax , year)
    //console.log(queryObj)
    conn.query(queryObj.query, queryObj.items ,(err,result,field)=>{
        conn.query(queryObj2.query,queryObj2.items,(err2,result2)=>{

            if(err || err2){
                console.log(err)
                console.log(err2)
            } else{
                //console.log(result)
                res.render("index/allVideos", {videos : result , video_count : result2[0].Count , Message : "MOVIE LIST" , p:p})
            }
        })
   
    })
})

router.get("/:id" , (req , res) => {
    // get info about video with id
    const id = req.params.id 
    conn.query(`SELECT * FROM film WHERE ID=?`,[id],(err,result,field)=>{
        if(err){
            console.log(err)
        } else{
            console.log(result)
            res.send('selected successfully')
        }
    })
})

router.post("/:id/comment" , (req , res) => {
    // get comments about video 
    let date_o = new Date();
    let datem = date_o.getDate();
    let yearm = date_o.getFullYear();
    let monthm = date_o.getMonth()+1;
    let date = yearm + '/' + monthm + '/' +datem ;
    const videoid = req.params.id
    const comment = req.body.comment
    const userid = req.session.id 
    conn.query(`INSERT INTO comment (User_ID,Movie_ID,date,text) VALUES (?,?,?,?)`,
        [userid,videoid,date,comment],(err,result,field)=>{
        if(err){
            console.log(err)
        }else{
            res.send('inserted successfully')
        }
    })
})

router.delete("/:id/comment" , (req , res) => {
    // get comment about video 
    const videoid = req.params.id
    const commentid = req.body.commentID
    const userid = req.session.id 
    conn.query(`DELETE FROM comment WHERE User_ID=? AND Movie_ID=? AND ID=?`,
        [userid,videoid,commentid],(err,result,field)=>{
        if(err){
            console.log(err)
        }else{
            res.send('deleted successfully')
        }
    })
})

router.post("/:id/rating" , (req , res)=> {
    // get starts for video
    const videoid = req.params.id
    const rating = req.body.rating
    const userid =  req.session.id 
    conn.query(`INSERT INTO stars (Rating , User_ID , Movie_ID) VALUES (?,?,?)`,
        [rating,userid,videoid],(err,result,field)=>{
        if(err){
            console.log(err)
        }else{
            res.send('Inserted successfully')
        }
    })

})

router.delete("/:id/rating" , (req , res)=> {
    // get starts for video
    const videoid = req.params.id
    const ratingid = req.body.ratingID
    const userid = req.session.id 
    conn.query(`DELETE FROM stars WHERE User_ID=? AND Movie_ID=? AND ID=?`,
    [userid,videoid,ratingid],(err,result,field)=>{
    if(err){
        console.log(err)
    }else{
        res.send('deleted successfully')
    }
})
})

router.put("/:id/rating" , (req , res)=> {
    // get starts for video
    const videoid = req.params.id
    const ratingid = req.body.ratingID
    const userid = req.session.id
    const rating = req.body.rating
    conn.query(`UPDATE stars SET Rating=? WHERE User_ID=? AND Movie_ID=? AND ID=?`,
    [rating,userid,videoid,ratingid],(err,result,field)=>{
    if(err){
        console.log(err)
    }else{
        res.send('Updated successfully')
    }
})
})

// function getvideoRating(id) {
//     // #get the video Rating
//     // return avg
//     const avg = 0 ;
//     conn.query(`SELECT AVG(Rating) AS AVERAGE FROM stars WHERE Movie_ID=?`,[id],(err,result,field)=>{
//         if(err){
//             console.log(err)
//         }else{
//              avg = result[0].AVERAGE
//            // res.send('average selected...')
//         }
//     })
//     return avg ;
// }

function getVideoComments(id){
    // #get video comments
}


function getSearchQuery(name,type,genre,Faverage, Taverage ,year , offset){
    let query = "SELECT * FROM film "
    const items = [{item : ["name" , name]} , {item : ["type" , type]} , {item : ["genre" , genre]} , {item : ["Faverage" , Faverage]} , {item : ["Taverage" , Taverage]} , {item : ["year" , year]}] ; 

    const result = items.filter((current) => {
        return current.item[1]
    })
    let resultItems = [] ;
    if (result.length > 0) {
        query += "WHERE "
        result.forEach(object => {
            if (object.item[0] == "Faverage") {
                query += "average > ? AND " ;
                resultItems.push(object.item[1])
            }
            else if (object.item[0] == "Taverage") {
                query += "average < ? AND " ;
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

function getSearchQuery2(name,type,genre,Faverage, Taverage ,year , offset){
    let query2 = "SELECT COUNT(ID) AS Count FROM film "
    const items = [{item : ["name" , name]} , {item : ["type" , type]} , {item : ["genre" , genre]} , {item : ["Faverage" , Faverage]} , {item : ["Taverage" , Taverage]} , {item : ["year" , year]}] ; 

    const result = items.filter((current) => {
        return current.item[1]
    })
    let resultItems = [] ;
    if (result.length > 0) {
        query2 += "WHERE "
        result.forEach(object => {
            if (object.item[0] == "Faverage") {
                query2 += "average > ? AND " ;
                resultItems.push(object.item[1])
            }
            else if (object.item[0] == "Taverage") {
                query2 += "average < ? AND " ;
                resultItems.push(object.item[1])
            } else{
                query2 += object.item[0] + " LIKE ? AND "
                resultItems.push(object.item[1] + "%")
            }
        })
        query2 += "1 " ;
    }

    return {query : query2 , items : resultItems};
}

module.exports = router ;