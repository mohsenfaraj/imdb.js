require("dotenv").config() ;
const express = require("express") ;
const app = express() ;
const mysql = require("mysql2/promise") ;
const install = require("./install")
const admin = require("./admin")
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require("express-session");
var MySqlSession = require("express-mysql-session")(session);

async function run() {
    const conn = await mysql.createConnection({
        host : process.env.DBHOST , 
        user : process.env.DBUSER ,
        password : process.env.DBPASS ,
        database : process.env.DBNAME
    })
    install(conn);
    var sessionStore = new MySqlSession({}/* session store options */, conn);
    app.use(session({
        key: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }));
    app.set("view engine" , "ejs") ;
    app.use("/assets" , express.static("assets"))
    // for parsing application/json
    app.use(bodyParser.json()); 

    // for parsing application/xwww-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true })); 

    // for parsing multipart/form-data
    app.use(upload.array()); 

    app.use("/admin" , [auth , admin])

    app.get("/" , (req , res) => {
        res.render("index")
    })

    app.get("/login" , (req , res) => {
        if (req.session.isLogged) {
            res.redirect("/admin")
        }
        else {
            res.render("login")
        }
    })

    app.get("/logout" , (req , res) => {
        req.session.destroy() ;
        res.redirect("/login");
    })

    app.post("/login" , (req , res) => {
        const email = req.body.email ;
        const password = req.body.password ;
            conn.query("SELECT * FROM admin WHERE email = ? AND password = ?" , [email , password])
            .then((result , fields)=> {
                if (result.length > 0) {
                    req.session.isLogged = true ;
                    res.redirect("/admin")
                }
                else {
                    res.render("regMessage" , {signin : true , headertext : "" ,
                    message : "the username or password is invalid."})
                }
            }).catch((err)=> {
                res.render("regMessage" , {signin : false , headertext : "there was an error" ,
                message : "there was an error"})
                console.log(err);
            })
    });
    
    app.get("/register" , (req , res) => {
        res.render("register")
    })

    app.post("/register" , (req , res) => {
        const name = req.body.username ;
        const email = req.body.email ;
        const password = req.body.password ;

        if (!name || !email || !password) {
            res.render("regMessage" , {signin : false , headertext : "fill all the fields" ,
            message : "please fill all the required fields"})
        }
        //TODO: hash the password

        //TODO: generate a gravatar image link
        conn.query("INSERT INTO `user` (`email`, `password`, `name`) VALUES (? , ? , ?)" ,
        [email , password , name]).then(([row , fields]) => {
            res.render("regMessage" , {signin : true , headertext : "Account Created!" ,
            message : "the creation of account was successful!"})
        }).catch((err) => {
            res.render("regMessage" , {signin : false , headertext : "Account Already Exists" ,
            message : "there was a problem in creating your account. check if acount already exists."})
        })
    })

    app.listen(3000 , () => {
        console.log("server is running on port 3000")
    })
}

// authenticate user
function auth(req , res , next) {
    if (req.session.isLogged === true) {
        next() ;
    }
    else {
        res.redirect("/login")
    }
}
run() ;