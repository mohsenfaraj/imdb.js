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
        res.send('delete film...')
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
              res.send(`added successfully`);
          }
      })
  })

    // ------------- Add Artists--------------
  
  router.get('/artist', (req, res) => {
    res.send("list of all artists")
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
        res.send('delete artist...')
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
                res.send(`added successfully`);
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
  const name = req.body.name
  const avatar = req.body.avatar
  conn.query(`INSERT INTO admin (email,password,name,avatar) VALUES (?,?,?,?)`,
  [email,password,name,avatar],(err,result,fields)=>{
    if(err){
      console.log(err)
    } else {
      res.send('admin added successfully')
    }
  })

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
  //req.query.offset
  //req.query.limit
  //req.body.status accepted/notaccepted/null/all
  //# get last 50 comments (accepted/not accepted/unknown/all)
  const status = req.body.accepted
  const offset = req.body.offset
  conn.query(`SELECT * FROM comment WHERE accepted=? LIMIT 50 OFFSET ?`,[status,offset],
  (err,result,field)=>{
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
})
router.delete("/comments" , (req , res) => {
  // #delete the comment by id
 
})
module.exports = router
