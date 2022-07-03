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
    const id =1//req.session.id
    conn.query(`SELECT * FROM user WHERE ID=?`,[id],(err,result,field)=>{
        if(err){
            console.log(err)
        } else {
           
            res.render("user/userrate", {information:result[0]})
        }
    })
})

router.put("/profile" , (req , res) => {
    // update user profile
    const id = req.session.id
    const password = req.body.password
    const birth = req.body.birth
    const name = req.body.name
    const address = req.query.address
    const avatar = req.body.avatar
    conn.query(`UPDATE user SET password=? , birth=? , name=? , address=? , avatar=? WHERE ID=?`,
    [password,birth,name,address,avatar,id],(err , result , field)=>{
        if(err){
            console.log(err)
        }else{
            res.send('updated successfully')
        }
    })
})

module.exports = router ;