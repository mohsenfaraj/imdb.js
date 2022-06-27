const express = require("express")
const router = express.Router()
const mysql = require("mysql2") ;
const conn = mysql.createConnection({
    host : process.env.DBHOST , 
    user : process.env.DBUSER ,
    password : process.env.DBPASS ,
    database : process.env.DBNAME
})

router.get('/', (req, res) => {
    res.send('administration main page')
  })


  router.get('/add', (req, res) => {
    res.render("addvid")
  })

  router.post('/addvid' , (req , res) => {
      const name = req.body.name ;
        conn.query('INSERT INTO test (name) VALUES (?) ' , [name] , (err, results, fields) => {
            if (err) {
                console.log(err)
            }
            else {
                res.send(`name ${name} added successfully`);
            }
      })
  })
module.exports = router
