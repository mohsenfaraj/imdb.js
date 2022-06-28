const { Console } = require("console");
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
    res.send('administration main page.....')
  })


       // -------------Add Videos--------------

  router.get('/editvideo', (req, res) => {
    res.send('Add Page.');
    res.render("addvid");
    
  })
  
  
  router.delete('/deletevid' , (req , res) =>{
    const id = req.body.ID;
    conn.query(  `DELETE FROM film WHERE ID=${id}` , (err , results , fields) =>{
      if(err){
          console.log(err)
      } else{
        res.send('delete film...')
      }
    })
  })
  
  router.put('/updatevid' , (req,res) =>{
    const name = req.body.name ;
    const type = req.body.type ;
    const cover = req.body.cover ;
    const genre = req.body.gener ;
    const dess = req.body.dess ;
    const year = req.body.year ;
    const content_rating = req.body.content_rating ;
    const company = req.body.company ;
    const date_published = req.body.date_published ;
    const country = req.body.country ;
    const average = req.body.average ;
    const comment_count = req.body.comment_count ;
    conn.query(`UPDATE film SET type ='${type}', name = '${name}',
    cover = '${cover}', genre = '${genre}', dess = '${dess}', year = '${year}',
    content_rating = '${content_rating}', company = '${company}',date_published = '${date_published}',
    country = '${country}', average = '${average}', comment_count = '${comment_count}'`
      , (err, results, fields) => {
      if (err) {
          console.log(err)
          console.log('have error!');
      }
      else {
          res.send(`update successfully`);
      }
})
  })

  router.post('/addvid' , (req , res) => {
      const name = req.body.name;
      const type = req.body.type ;
      const cover = req.body.cover ;
      const genre = req.body.genre ;
      const dess = req.body.dess ;
      const year = req.body.year ;
      const content_rating = req.body.content_rating ;
      const company = req.body.company ;
      const date_published = req.body.date_published ;
      const country = req.body.country ;
      const average = req.body.average ;
      const comment_count = req.body.comment_count ;

      conn.query(`INSERT INTO film(type, name, cover, genre, dess, year,
        content_rating, company,date_published, country, average,
          comment_count) VALUES ('${type}','${name}',
            '${cover}','${genre}','${dess}','${year}',
            '${content_rating}','${company}','${date_published}',
            '${country}','${average}','${comment_count}')`,
             (err, results, fields) => {
          if (err) {
              console.log(err)
          }
          else {
              res.send(`added successfully`);
          }
      })
  })

    // ------------- Add Artists--------------
  router.get('/editartist', (req, res) => {
    res.render("addvid")
  })

  router.delete('/deleteartists', (req , res)=>{
    const id = req.body.ID;
    conn.query(`DELETE FROM artists WHERE ID=${id}`,(err , results , fields) =>{
      if(err){
          console.log(err)
      } else{
        res.send('delete artist...')
      }
    })
  })

  router.post('/addartists' , (req , res) => {
      const name = req.body.name ;
      const avatar = req.body.avatar ;
      const bio = req.body.bio ;
      const role = req.body.role ;

        conn.query(`INSERT INTO artists (name,avatar,bio,role) VALUES ('${name}','${avatar}'
          ,'${bio}','${role}') `, (err, results, fields) => {
            if (err) {
                console.log(err)
            }
            else {
                res.send(`added successfully`);
            }
      })
  })

  router.put('/updateartists' , (req,res) =>{
    const name = req.body.name ;
    const avatar = req.body.avatar ;
    const bio = req.body.bio ;
    const role = req.body.role ;

    conn.query(`UPDATE artists SET name='${name}',avatar='${avatar}'
    ,bio='${bio}',role='${role}'`,(err , result , fields)=>{
      if(err){
        console.log(err)
      } else{
        res.send(`updated successfully`)
      }
    })
  })

  //-----------Movie And Artists------------
  router.get('/editemoveartists',(req,res)=>{
    res.render("addvid")
  })

  router.delete('/deletemovieartists' , (req,res)=>{
    const movie_id = req.body.Movie_ID
    const artists_id = req.body.Artists_ID
    conn.query(`DELETE FROM movie_has_artists WHERE Movie_ID='${movie_id}' ,
       Artists_ID='${artists_id}'`,(err , result , fields)=>{

    })
  })

  router.post('/addmovieartists',(req , res) =>{
    const movie_ID = req.body.Movie_ID
    const artists_ID = req.body.Artists_ID 
    conn.query(`INSERT INTO movie_has_artists(Movie_ID,Artists_ID) VALUES ('${movie_ID}',
    '${artists_ID}')`,(err,result,fields)=>{
      if(err){
        console.log(err)
      } else {
        res.send(`add successfully`)
      }
    })
  })
  router.put('/updatemovieartists',(req,res)=>{
    const movie_id = req.body.Movie_ID
    const artists_id = req.body.Artists_ID 
    conn.query(`UPDATE movie_has_artists SET Movie_ID='${movie_id}',
         Artists_ID='${artists_id}'`,(err,result,fields)=>{
      if(err){
        console.log(err)
      } else {
        res.send(`update successfully`)
      }
    })
  })
module.exports = router
