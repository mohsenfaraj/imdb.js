require("dotenv").config() ;
const express = require("express") ;
const app = express() ;
const mysql = require("mysql2/promise") ;
const install = require("./install")
const admin = require("./admin")
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
async function run() {
    const conn = await mysql.createConnection({
        host : process.env.DBHOST , 
        user : process.env.DBUSER ,
        password : process.env.DBPASS ,
        database : process.env.DBNAME
    })
    // install(conn);
    const user = {
        name : "koosha" ,
        lastname : "refahi"
    }
    admin.connection = conn ;
    app.set("view engine" , "ejs") ;
    app.use("/assets" , express.static("assets"))
    // for parsing application/json
    app.use(bodyParser.json()); 

    // for parsing application/xwww-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true })); 

    // for parsing multipart/form-data
    app.use(upload.array()); 

    app.use("/admin" , admin)

    app.get("/" , (req , res) => {
        res.render("index" , {user : user})
    })
    
    app.listen(3000 , () => {
        console.log("server is running on port 3000")
    })
}
run() ;