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
  (async () => {
   const [videoCount] = await conn.promise().query("SELECT COUNT(film.ID) AS Count FROM `film`")
   const [artistCount] = await conn.promise().query("SELECT COUNT(artists.ID) AS Count FROM `artists`")
   const [commentsCount] = await conn.promise().query("SELECT COUNT(comment.ID) AS Count FROM `comment`")
   const [banned] = await conn.promise().query("SELECT COUNT(user.ID) AS Count FROM `user` WHERE banned = 1")
   const [users] = await conn.promise().query("SELECT COUNT(user.ID) AS Count FROM `user`")
   const [waitingCount] = await conn.promise().query("SELECT COUNT (comment.ID) AS Count FROM `comment` WHERE comment.accepted = 9")
   res.render("admin/dashboard" , {
     name : req.session.name ,
     videoCount : videoCount[0].Count || 0 ,
     artistCount : artistCount[0].Count || 0,
     commentsCount : commentsCount[0].Count || 0,
     bannedCount : banned[0].Count || 0,
     usersCount : users[0].Count || 0 ,
     waitingCount : waitingCount[0].Count || 0
   })
  })()
  })


  router.get("/adminprofile",(req,res)=>{
    const id = 1// Number.parseInt(req.session.id)
    conn.query(`SELECT * FROM admin WHERE ID=?`,[id],(err,result)=>{
      if(err){
        console.log(err)
      }else{
       res.render("admin/updateAdmin",{info:result[0]})
       
      }
    })
  })

  router.post("/adminprofile",(req,res)=>{
    const id = 1 // Number.parseInt(req.session.id)
    const name = req.body.name
    const avatar = req.body.avatar
    if(!name && avatar){
      conn.query(`UPDATE admin SET avatar=? WHERE ID=?`,[avatar,id],(err,result)=>{
        if(err){
          console.log(err)
        }else{
        res.redirect("/admin/adminprofile")     
        }
      })
    }else if(name && !avatar){
      conn.query(`UPDATE admin SET name=? WHERE ID=?`,[name,id],(err,result)=>{
        if(err){
          console.log(err)
        }else{
        res.redirect("/admin/adminprofile")     
        }
      })
    }else if(name && avatar){
      conn.query(`UPDATE admin SET avatar=?,name=? WHERE ID=?`,[avatar,name,id],(err,result)=>{
        if(err){
          console.log(err)
        }else{
        res.redirect("/admin/adminprofile")     
        }
      })
    }else{
      res.render("regMessage", {
        headertext: "",
        message: "Fields are null!"
    })

    }

  })

  router.post("/changepass",(req,res)=>{
    const ID = 1 // Number.parseInt(req.session..id)
    const oldpassword = req.body.oldpassword
    const newpassword = req.body.newpassword
    const cnewpassword = req.body.cnewpassword
    conn.query(`SELECT password FROM admin WHERE  ID=?`, [ID], (err, result) => {
        if (err) {
            console.log(err)
        } else {

            if (result[0].password !== oldpassword) {
                console.log('not equal oldpass')
                res.render("regMessage", {
                    headertext: "",
                    message: "the old password is incorrect"
                })

            } else {
                if (newpassword !== cnewpassword) {
                    console.log('not equal cnew ')
                    res.render("regMessage", {
                        headertext: "",
                        message: "the new password not equal with Confirm password!"
                    })
                } else {
                    conn.query(`UPDATE admin SET password=? WHERE ID=?`, [newpassword, ID], (err1, result1) => {
                        if (err1) {
                            console.log(err1)
                        } else {
                            res.redirect("/admin/adminprofile")
                        }
                    });
                }
            }

        }
    });
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
        content_rating, company,date_published, country) VALUES (?,?,?,?,?,?,?,?,?,?)`,[type,name,
            cover,genre,description,year,
            content_rating,company,date_published,
            country,comment_count],
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
    const id = Number.parseInt(req.params.id) ;
    conn.query("SELECT artists.ID , artists.name , artists.role , movie_has_artists.description FROM movie_has_artists , artists WHERE artists.ID = movie_has_artists.Artists_ID AND artists.ID = ?" , [id] , (err , result , fields) => {
      if (err) {
        console.log(err)
      }
      res.render("admin/addArtistToVideo" , {artists : result , videoID : id})
    })
  })

  router.delete('/video/:id/artist' , (req,res)=>{
    const movie_id = req.params.id
    const artists_id = req.body.artistID
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
    const artists_ID = req.body.artistID 
    const artistDesc = req.body.artistDesc ;
    conn.query(`INSERT INTO movie_has_artists (Movie_ID,Artists_ID ,Description) VALUES (?,?,?)` , [movie_ID,
    artists_ID , artistDesc],(err,result,fields)=>{
      if(err){
        console.log(err)
      } else {
        res.redirect("/admin/video/" + movie_ID + "/artist")
      }
    })
  })

  // --- --- Manage Awards --- --- //
  router.get('/video/:id/award',(req,res)=>{
    const id = Number.parseInt(req.params.id) ;
    conn.query("SELECT awards.ID , awards.name , film.id AS filmID , film.name AS filmName, artists.id AS artistID , artists.name AS artistName from awards , film , artists WHERE awards.Movie_ID = ? AND awards.Movie_ID = film.ID AND awards.Artists_ID = artists.ID" , [id] , (err , result , fields) => {
      if (err) {
        console.log(err)
      }
      console.log(result)
      res.render("admin/addAwardToVideo" , {awards : result , videoID : id})
    })
  })

  router.delete('/video/:id/award' , (req,res)=>{
    const id = req.body.awardID ;
    conn.query(`DELETE FROM awards WHERE ID=?`,[id],(err , result , fields)=>{
        if(err){
          console.log(err)
        }else{
          res.send('deleted successfully')
        }
    })
  })

  router.post('/video/:id/award',(req , res) =>{
    const movieID = req.params.id
    const artistID = req.body.artistID 
    const awardDesc = req.body.artistDesc
    const date = req.body.date
    const name = req.body.name
    conn.query(`INSERT INTO awards(Name, Date, Description, Movie_ID, Artists_ID) VALUES (?,?,?,?,?)` ,
     [name , date , awardDesc , movieID , artistID],(err,result,fields)=>{
      if(err){
        console.log(err)
        res.render("regMessage", {
          headertext: "Error",
          message: "there was an error"
      })
      } else {
        res.redirect("/admin/video/" + movieID + "/award")
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
