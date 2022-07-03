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
    const id =1//req.session.id
    conn.query(`SELECT * FROM user WHERE ID=?`,[id],(err,result,field)=>{
        if(err){
            console.log(err)
        } else {
           
            res.render("user/profile", {information:result[0]})
        }
    })
})
router.get("/userrate" , (req , res) => {
    const id =req.session.user.id
    try{
        (async()=>{
            const [result1] = await conn.promise().query(`SELECT * FROM user WHERE ID=?`,[id]);
            const [result2] = await conn.promise().query(`SELECT film.name,film.year,comment.text,comment.date,stars.Rating `+
            `FROM comment INNER JOIN stars INNER JOIN film ON comment.User_ID=stars.User_ID AND comment.Movie_ID=film.ID AND `+
            `stars.Movie_ID=film.ID AND comment.Movie_ID=stars.Movie_ID `); // FAGHAT ON HAEE RO BAR MIGARDONE KE HAN RATE DADE HAM COMMENT
            console.log(result2)
            res.render("user/userrate",
            {
                information:result1[0],
                reatedmovies:result2
            
            })
          })()
      
    }catch(error){
        console.log(error)
    }
    
    
           
            
        
    })


router.post("/profile" , (req , res) => {
    // update user profile
    const ID =req.session.user.id
    const password = req.body.password
    const username = req.body.username
    const name   = req.body.name
    const email  = req.query.email
    const avatar = req.body.avatar
    const queryobj=getUpdateQuery(email,username,name,avatar,ID)
     conn.query(queryobj.query,queryobj.items,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            
            res.send('updated...')
        }
     })

})

function getUpdateQuery(email,username,name,avatar,ID){
    let query = "UPDATE user SET "
    const items = [{item : ["email" , email]} , {item : ["username" , username]} , {item : ["name" , name]} , {item : ["avatar" , avatar]} ] ; 

    const result = items.filter((current) => {
        return current.item[1]
    })
    let resultItems = [] ;
    if (result.length > 0) {
        result.forEach(object => {
                query += object.item[0] + "=? "
                resultItems.push(object.item[1])
        })
        query += "WHERE ID=?" ;
        resultItems.push(ID)
    }
    
    return {query : query , items : resultItems};
}

module.exports = router ;