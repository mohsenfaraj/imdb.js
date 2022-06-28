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
    res.render("admin")
  })

  router.get("/video" , (req , res) => {
    res.send("list of all videos")
  })

  router.get('/video/:id', (req, res) => {
    res.send('Add Page.');
    res.render("addvid");
    
  })
  
  
  router.delete('/video/:id' , (req , res) =>{
    const id = req.params.id;
    conn.query(  `DELETE FROM film WHERE ID=${id}` , (err , results , fields) =>{
      if(err){
          console.log(err)
      } else{
        res.send('delete film...')
      }
    })
  })
  
  router.put('/video/:id' , (req,res) =>{
    const id = req.params.id ;
    const name = req.body.name ;
    const type = req.body.type ;
    const cover = req.body.cover ;
    const genre = req.body.gener ;
    const description = req.body.description ;
    const year = req.body.year ;
    const content_rating = req.body.content_rating ;
    const company = req.body.company ;
    const date_published = req.body.date_published ;
    const country = req.body.country ;
    const average = req.body.average ;
    const comment_count = req.body.comment_count ;
    conn.query(`UPDATE film SET type =?, name = ?,
    cover = ?, genre = ?, description = ?, year = ?,
    content_rating = ?, company = ?,date_published = ?,
    country = ?, average = ?, comment_count = ? WHERE id = ?` , 
    [type , name , cover , genre , description , year , content_rating , company , date_published , country , average , comment_count , id ] ,
     (err, results, fields) => {
      if (err) {
          console.log(err)
          console.log('have error!');
      }
      else {
          res.send(`update successfully`);
      }
    })
  })

  router.get("/video/add" , (req , res) => {

  })
  router.post('/video/add' , (req , res) => {
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
  
  router.get('/artist', (req, res) => {
    res.send("list of all artists")
  })

  router.delete('/artist/:id', (req , res)=>{
    const id = req.params.id;
    conn.query(`DELETE FROM artists WHERE ID=${id}`,(err , results , fields) =>{
      if(err){
          console.log(err)
      } else{
        res.send('delete artist...')
      }
    })
  })

  router.post('/artist/add' , (req , res) => {
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

  router.put('/artist/:id' , (req,res) =>{
    const id = req.params.id ;
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
  router.get('/video/:id/artist',(req,res)=>{
    res.render("addvid")
  })

  router.delete('/video/:id/artist' , (req,res)=>{
    const movie_id = req.body.Movie_ID
    const artists_id = req.body.Artists_ID
    conn.query(`DELETE FROM movie_has_artists WHERE Movie_ID='${movie_id}' ,
       Artists_ID='${artists_id}'`,(err , result , fields)=>{

    })
  })

  router.post('/video/:id/artist',(req , res) =>{
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
  router.put('/video/:id/artist',(req,res)=>{
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
