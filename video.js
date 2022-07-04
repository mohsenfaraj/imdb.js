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
                res.render("index/allVideos", {videos : result , video_count : result2[0].Count , Message : "MOVIE LIST" 
                , p:p , user: req.session.user})
            }
        })
   
    })
})

router.get("/:id" , (req , res) => {
    const id = req.params.id ;
    try
    {
    (async () => {
        const [filmdata] = await conn.promise().query(`SELECT * FROM film WHERE ID=?`,[id]) ;
        const genre = filmdata[0].genre
        if (filmdata.length == 0) {
            res.render("index/page404")
            return ;
        }
        const [comments] = await conn.promise().query(`SELECT user.name , user.avatar , comment.text , comment.date FROM user,comment WHERE user.ID = comment.User_ID AND comment.Movie_ID=? AND accepted=1`,[id]);
        const [commentCount] = await conn.promise().query(`SELECT COUNT(ID) AS COUNTCO FROM comment WHERE Movie_ID=? AND accepted=1`,[id]);
        const [artists] = await conn.promise().query(`SELECT artists.id , artists.name , artists.role , artists.avatar , movie_has_artists.description FROM artists,movie_has_artists WHERE movie_has_artists.Artists_ID=artists.ID AND  movie_has_artists.Movie_ID=?`,[id]);
        const [relativeVideos] = await conn.promise().query(`SELECT film.name , film.description , film.average , film.cover , film.year FROM  film  WHERE film.genre=? AND film.ID NOT LIKE ?  `,[genre,id]);
        const [relativeCount] = await conn.promise().query(`SELECT COUNT(film.genre) AS REFI FROM  film  WHERE film.genre=? AND film.ID NOT LIKE ?  `,[genre,id]);
        const [awards] = await conn.promise().query(`SELECT Name ,Date ,Description  FROM awards  WHERE  Movie_ID=?  `,[id]);
        const [awardsCount] = await conn.promise().query(`SELECT COUNT(ID) AS CORE FROM awards  WHERE  Movie_ID=?  `,[id]);
        const options = {
            video:filmdata[0] ,
            reviews : comments,
            count : commentCount[0].COUNTCO ,
            artists : artists ,
            relatedmovie:relativeVideos ,
            countf:relativeCount[0].REFI ,
            faward:awards ,
            countre:awardsCount[0].CORE ,
            user: req.session.user 
        }
        if (req.session.user) {
            const [rating] = await conn.promise().query("SELECT Rating FROM stars WHERE User_ID = ? AND Movie_ID = ?" , [req.session.user.id , id]);
            options.rating = rating[0].Rating ;
        }
        res.render("index/singleVideo", options)
    })();
    }catch(error) {
        console.log(error);
    }
});

router.post("/:id/comment" , (req , res) => {
    // get comments about video 
    let date_o = new Date();
    let datem = date_o.getDate();
    let yearm = date_o.getFullYear();
    let monthm = date_o.getMonth()+1;
    let date = yearm + '/' + monthm + '/' +datem ;
    const videoid = req.params.id
    const comment = req.body.comment
    const userid = req.session.user.id  
    if (req.session.user.banned || !req.session.user.id) {
        res.redirect("back") ;
    }
    conn.query(`INSERT INTO comment (User_ID,Movie_ID,date,text) VALUES (?,?,?,?)`,
        [userid,videoid,date,comment],(err,result,field)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect("back")
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
    const userid =  req.session.user.id 
    if (!userid || !rating || !videoid) {
        res.status(300).send("you need to send all information");
        return ;
    }
    //check if user already rated
    conn.query("SELECT ID FROM stars WHERE User_ID = ? AND Movie_ID = ?" , [userid , videoid] , (err , result , fields) => {
        if (err) {
            console.log(err)
        }
        if (result.length > 0) {
            const id = result[0].ID ;
            conn.query(`UPDATE stars SET Rating=? WHERE User_ID=? AND Movie_ID=? AND ID=?`,
            [rating,userid,videoid,id],(err,result,field)=>{
            if(err){
                console.log(err)
            }
                res.status(200).send("updated the rating")
            })
        }
        // if not insert the rating into stars table
        else {
            conn.query(`INSERT INTO stars (Rating , User_ID , Movie_ID) VALUES (?,?,?)`,
            [rating,userid,videoid],(err,result,field)=>{
            if(err){
                console.log(err)
            }else{
                res.status(200).send('Inserted successfully')
            }
        })
        }
    })
})

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