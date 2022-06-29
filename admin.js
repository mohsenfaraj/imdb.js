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
    res.render("admin/dashboard" , {name : req.session.name})
  })

  router.get("/video" , (req , res) => {
    conn.query("SELECT ID , type , name , date_published FROM film" , (error , results) => {
      if (error) {
        console.log(error)
      }
      else {
        let videos = results ;
        res.render("admin/allVideos" , {videos : videos});
      }
    })
  })

  router.get('/video/:id(\\d+)', (req, res) => {
    res.send('Add Page.');
    // res.render("addvid");
    
  })
  
  
  router.delete('/video/:id(\\d+)' , (req , res) =>{
    const id = req.params.id;
    conn.query(`DELETE FROM film WHERE ID=?`,[id] , (err , results , fields) =>{
      if(err){
          console.log(err)
      } else{
        res.status(200).send("film removed!");
      }
    })
  })
  
  router.put('/video/:id(\\d+)' , (req,res) =>{
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
    res.render("admin/addvideo" , {name: req.session.name})
  })

  router.post('/video/add' , (req , res) => {
      const name = req.body.name;
      const type = req.body.type ;
      const cover = req.body.cover ;
      const genre = req.body.genre ;
      const description = req.body.description ;
      const year = req.body.year ;
      const content_rating = req.body.content_rating ;
      const company = req.body.company ;
      const date_published = req.body.date_published ;
      const country = req.body.country ;
      const average = req.body.average ;
      const comment_count = req.body.comment_count ;

      conn.query(`INSERT INTO film (type, name, cover, genre, description, year,
        content_rating, company,date_published, country, average,
          comment_count) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,[type,name,
            cover,genre,description,year,
            content_rating,company,date_published,
            country,average,comment_count],
             (err, results, fields) => {
          if (err) {
              console.log(err)
          }
          else {
              res.render("admin/addVideo" , {
                toast : {type:"success" , header : "Video Added!" , body : "Video Added Successfuly!"}
              })
          }
      })
  })

    // ------------- Add Artists--------------
  
  router.get('/artist', (req, res) => {
    conn.query("SELECT ID , name , bio , role FROM artists" , (error , results) => {
      if (error) {
        console.log(error)
      }
      else {
        let artists = results ;
        res.render("admin/allArtists" , {artists : artists});
      }
    })
  })

  router.get("/artist/add" , (req , res) => {
    res.render("admin/addArtist")
  })

  router.delete('/artist/:id(\\d+)', (req , res)=>{
    const id = req.params.id;
    conn.query(`DELETE FROM artists WHERE ID=?`,[id],(err , results , fields) =>{
      if(err){
          console.log(err)
      } else{
        res.status(200).send("film removed!");
      }
    })
  })

  router.post('/artist/add' , (req , res) => {
      const name = req.body.name ;
      const avatar = req.body.avatar ;
      const bio = req.body.bio ;
      const role = req.body.role ;

        conn.query(`INSERT INTO artists (name,avatar,bio,role) VALUES (?,?,?,?)`,[name,avatar,bio,role], (err, results, fields) => {
            if (err) {
                console.log(err)
            }
            else {
              res.render("admin/addArtist" , {
                toast : {type:"success" , header : "Artist Added!" , body : "Artist Added Successfuly!"}
              })
            }
      })
  })

  router.put('/artist/:id(\\d+)' , (req,res) =>{
    const id = req.params.id ;
    const name = req.body.name ;
    const avatar = req.body.avatar ;
    const bio = req.body.bio ;
    const role = req.body.role ;

    conn.query(`UPDATE artists SET name=?,avatar=?
    ,bio=?,role=? WHERE ID=?`,[name,avatar,bio,role,id],(err , result , fields)=>{
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
    const movie_id = req.params.id
    const artists_id = req.body.Artists_ID
    conn.query(`DELETE FROM movie_has_artists WHERE Movie_ID=? AND
       Artists_ID=?`,[movie_id,artists_id],(err , result , fields)=>{
        if(err){
          console.log(err)
        }else{
          res.send('deleted successfully')
        }
    })
  })

  router.post('/video/:id/artist',(req , res) =>{
    const movie_ID = req.params.id
    const artists_ID = req.body.Artists_ID 
    conn.query(`INSERT INTO movie_has_artists (Movie_ID,Artists_ID) VALUES (?,?)` , [movie_ID,
    artists_ID],(err,result,fields)=>{
      if(err){
        console.log(err)
      } else {
        res.send(`add successfully`)
      }
    })
  })

  //--------- Manage Users --------/

router.put("/user/ban" , (req , res) => {
  //#ban the user
  const user_id = req.body.ID
  const banned = req.body.banned
  conn.query(`UPDATE user SET banned=? WHERE ID=? `,[banned,user_id],(err,result,fields)=>{
    if(err){
      console.log(err)
    } else{
      res.send('user banned...')
    }
  })
})

router.post("/user/addAdmin" , (req , res) => {
  // #add admin
  const email = req.body.email
  const password = req.body.password
  const birth = req.body.birth
  const name = req.body.name
  const address = req.body.address
  const avatar = req.body.avatar
  const permissions = req.body.permissions

  conn.query(`INSERT INTO admin (email,password,birth,name,address,avatar,permissions) VALUES (?,?,?,?,?,?,?)`,
  [email,password,birth,name,address,avatar,permissions],(err,result,fields)=>{
    if(err){
      console.log(err)
    } else {
      res.send('admin added successfully')
    }
  })

})

  //--------- Manage Comments --------/
router.get("/comments" , (req , res) => {
  // const offset = Number.parseInt(req.query.offset) || 0 ;
  // const status = Number.parseInt(req.query.offset) || 9 ;
  const status = 1 ;
  const offset = 0 ; 
  // const status = req.query.status
  conn.query(`SELECT * FROM comment WHERE accepted = ? LIMIT 50 OFFSET ? ` , [status , offset],
    (err,result,fields)=>{
      if(err){
        console.log(err)
      } else{
        console.log(result)
        res.send('selected successfully') 
      }
  })
})

router.put("/comments" , (req , res) => {
  //# set comment to accepted or not accepted
  //req.body.status accepted/notaccepted/null
  // example: req.body.id = 5  
  const id = req.body.ID
  const accepted = req.body.accepted
  conn.query(`UPDATE comment SET accepted=? WHERE ID=?`,[accepted,id],(err,result,fields)=>{
    if(err){
      console.log(err)
    } else{
      res.send(`updated successfully`)
    }
  })   
})
router.delete("/comments" , (req , res) => {
  // #delete the comment by id
  const id = req.body.ID
  conn.query(`DELETE FROM comment WHERE ID=?`,[id],(err,result,fields)=>{
    if(err){
      console.log(err)
    } else {
      res.send('deleted successfully')
    }
  }) 
})
module.exports = router
