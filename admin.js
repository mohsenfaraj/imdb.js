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
    const id = req.params.id ;
    conn.query("SELECT * FROM film WHERE id = ?" , [id] , (error , result) => {
      if (error) {
        console.log(error)
      }
      else {
        console.log(result[0])
        res.render("admin/addVideo" , {update : result[0]});
      }
    })    
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
  
  router.post('/video/:id(\\d+)' , (req,res) =>{
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
      }
      else {
          res.redirect("/admin/video")
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

  router.get('/artist/:id(\\d+)' , (req,res) =>{
    conn.query("SELECT ID , name , bio , role , avatar FROM artists" , (error , result) => {
      if (error) {
        console.log(error)
      }
      else {
        res.render("admin/addArtist" , {update : result[0]})
      }
    })
  })

  router.post('/artist/:id(\\d+)' , (req,res) =>{
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
        res.redirect("/admin/artist")
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

router.get("/user/ban" , (req , res) => {
  res.render("admin/banUser")
})

router.post("/user/ban" , (req , res) => {
  //#ban the user
  const user_id = Number.parseInt(req.body.id);
  const banned = req.body.banned
  let banCode ;
  if (banned == "ban") {
    banCode = 1 ;
  }
  else {
    banCode = 0 ;
  }
  if (!user_id) {
    res.render("admin/banUser" , {
      toast : {type:"warning" , header : "ID Required" , body : "you havn't specified the id to ban."}
    });
    res.end() ;
  }
  else {
    conn.query(`UPDATE user SET banned=? WHERE ID=? `,[banCode,user_id],(err,result,fields)=>{
      if(err){
        console.log(err)
      } else{
        res.render("admin/banUser" , {
          toast : {type:"success" , header : `user ${banned}ed!` , body : `user ${banned}ed successfully.`}
        });
      }
    })
  }
})

router.get("/user/addAdmin" , (req , res) => {
  res.render("admin/addAdmin");
})

router.post("/user/addAdmin" , (req , res) => {
  const email = req.body.email
  const password = req.body.password
  const repassword = req.body.repassword 
  const name = req.body.name
  const avatar = req.body.avatar
  if (password !== repassword) {
    res.render("admin/addAdmin" , {
      toast : {type:"warning" , header : "passwords don't match" , body : "please pay attention to entering correct password."}
    });
    res.end() ;
  }
  else {
    conn.query(`INSERT INTO admin (email,password,name,avatar) VALUES (?,?,?,?)`,
    [email,password,name,avatar],(err,result,fields)=>{
      if(err){
        console.log(err)
      } else {
        res.render("admin/addAdmin" , {
          toast : {type:"success" , header : "Admin added!" , body : "new Admin added successfully!"}
        });
      }
    })
  }
})

router.put("/profile",(req,res)=>{
  // Admin profile update
  const id = req.session.id
  const password = req.body.password
  const name = req.body.name
  const avatar = req.body.avatar 
  conn.query(`UPDATE admin SET password=? , name=? , avatar=? WHERE ID=?`,[password,name,
    avatar,id],
   (err,result,field)=>{
    if(err){
      console.log(err)
    }else{
      res.send('updated successfully')
    }
  })

})

  //--------- Manage Comments --------/
router.get("/comments" , (req , res) => {
  const status = req.body.accepted 
  const offset = Number.parseInt(req.body.offset) || 0
  conn.query(`SELECT * FROM comment LIMIT 50 OFFSET ?`,[offset],
  // conn.query(`SELECT * FROM comment WHERE accepted=? LIMIT 50 OFFSET ?`,[status , offset],
  (err,result,field)=>{
    if(err){
      console.log(err)
    } else{
      res.render("admin/manageComments" , {comments : result})
    }

  })
})

router.post("/comments" , (req , res) => {
  //# set comment to accepted or not accepted
  //req.body.status accepted/notaccepted/null
  // example: req.body.id = 5 
  const accepted = Number.parseInt(req.body.accepted)
  const id = Number.parseInt(req.body.id)
  console.log(accepted , id)
  conn.query(`UPDATE comment SET accepted=? WHERE ID=?`,
    [accepted,id],(err,result,field)=>{
    if(err){
      console.log(err)
    }else{
      res.send('updated successfully')
    }
  })    
})
router.delete("/comments" , (req , res) => {
  // #delete the comment by id
  const id = Number.parseInt(req.body.ID)
  conn.query(`DELETE FROM comment WHERE ID=?`,[id],(err,result,field)=>{
    if(err){
      console.log(err)
    }else{
      res.send('deleted successfully')
    }
  })
 
})
module.exports = router
