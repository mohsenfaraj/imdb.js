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
    const id =req.session.user.id
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
            const [result2] = await conn.promise().query(`SELECT film.name,film.year,film.cover,comment.text,comment.date FROM comment INNER JOIN film WHERE comment.User_ID=? AND comment.Movie_ID=film.ID`,[id]);
            const [result3] = await conn.promise().query(`SELECT COUNT(comment.text) AS COCO FROM comment INNER JOIN film WHERE comment.User_ID=? AND comment.Movie_ID=film.ID`,[id]);  
            const [result4] = await conn.promise().query(`SELECT film.name,film.year,film.cover,stars.Rating FROM stars INNER JOIN film WHERE stars.User_ID=? AND stars.Movie_ID=film.ID`,[id]);
            const [result5] = await conn.promise().query(`SELECT COUNT(stars.Rating) AS COST FROM stars INNER JOIN film WHERE stars.User_ID=? AND stars.Movie_ID=film.ID`,[id]);  
            res.render("user/userrate",
            {
                information:result1[0],
                commentsmovies:result2,
                comment_count:result3[0].COCO,
                ratesmovies:result4,
                rate_count:result5[0].COST
            
            })
          })();
      
    }catch(error){
        console.log(error)
    }
    
    
           
            
        
    })


router.post("/profile" , (req , res) => {
    // update user profile
    const ID = Number.parseInt(req.session.user.id)
    const password = req.body.password
    const name   = req.body.name
   
    //const queryobj=getUpdateQuery(email,username,name,ID)
     conn.query(`UPDATE user SET name=?`,[name],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            
            res.send('updated...')
        }
     })

})




// function getUpdateQuery(email,username,name,ID){
//     let query = "UPDATE user SET "
//     const items = [{item : ["email" , email]} , {item : ["username" , username]} , {item : ["name" , name]}  ] ; 

//     const result = items.filter((current) => {
//         return current.item[1]
//     })
//     let resultItems = [] ;
//     if (result.length > 0) {
//         result.forEach(object => {
//                 query += object.item[0] + "=? "
//                 resultItems.push(object.item[1])
//         })
//         query += "WHERE ID=?" ;
//         resultItems.push(ID)
//     }
    
//     return {query : query , items : resultItems};
            // SELECT film.name,film.year,comment.text,comment.date,stars.Rating `+
            // `FROM comment INNER JOIN stars INNER JOIN film ON comment.User_ID=stars.User_ID AND comment.Movie_ID=film.ID AND `+
            // `stars.Movie_ID=film.ID AND comment.Movie_ID=stars.Movie_ID
// }

module.exports = router ;