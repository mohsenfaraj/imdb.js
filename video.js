const express = require("express")
const router = express.Router()
const mysql = require("mysql2") ;
const conn = mysql.createConnection({
    host : process.env.DBHOST , 
    user : process.env.DBUSER ,
    password : process.env.DBPASS ,
    database : process.env.DBNAME
})
router.get("/" , (req , res) => {
    res.send("videos")
    // #get all x videos 
    // req.query.limit => mahdood be chand ta natije shavad
    // req.query.skip => chand taye avvali ra rad konad
})

router.get("/:id" , (req , res) => {
    // get info about video with id
})

router.post("/:id/comment" , (req , res) => {
    // get comments about video 
    // id = req.session.id     comment = req.body.comment    videoid = req.params.id
})

router.delete("/:id/comment" , (req , res) => {
    // get comment about video 
    // id = req.session.id     commentID = req.body.commentID    videoid = req.params.id
})

router.post("/:id/rating" , (req , res)=> {
    // get starts for video
    // id = req.session.id     rating = req.body.rating    videoid = req.params.id
})

router.delete("/:id/rating" , (req , res)=> {
    // get starts for video
    // id = req.session.id     ratingID = req.body.ratingID    videoid = req.params.id
})

router.delete("/:id/rating" , (req , res)=> {
    // get starts for video
    // id = req.session.id  rating = req.body.rating   ratingID = req.body.ratingID  videoid = req.params.id 
})

function getvideoRating(id) {
    // #get the video Rating
}

function getVideoComments(id){
    // #get video comments
}

module.exports = router ;