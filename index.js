require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const admin = require("./admin");
const video = require("./video");
const artists = require("./artists");
const user = require("./user");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var session = require("express-session");
var MySqlSession = require("express-mysql-session")(session);

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
  });
  var sessionStore = new MySqlSession({} /* session store options */, conn);
  app.use(
    session({
      key: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.set("view engine", "ejs");
  app.use("/assets", express.static("assets"));
  app.use("/public", express.static("public"));

  // for parsing application/json
  app.use(bodyParser.json());

  // for parsing application/xwww-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.raw());

  // for parsing multipart/form-data
  app.use(upload.array());

  app.use("/admin", [auth, admin]);

  app.get("/", (req, res) => {
    try {
      // series , movie
      (async () => {
        const series = "Series";
        const movie = "Movie";
        const [result1] = await conn.query(
          `SELECT name,ID,cover,genre,average FROM film WHERE average>5 LIMIT 12`
        );
        const [result2] = await conn.query(
          `SELECT name,cover,ID,average FROM film WHERE type=? ORDER BY date_published DESC LIMIT 5 `,
          [movie]
        );
        const [result3] = await conn.query(
          `SELECT name,cover,ID,average FROM film  WHERE type=? ORDER BY average DESC LIMIT 5`,
          [movie]
        );
        const [result4] = await conn.query(
          `SELECT name,cover,ID,average FROM film  WHERE type=? ORDER BY comment_count DESC LIMIT 5`,
          [movie]
        );
        const [result5] = await conn.query(
          `SELECT name,cover,ID,average FROM film WHERE type=? ORDER BY date_published DESC LIMIT 5`,
          [series]
        );
        const [result6] = await conn.query(
          `SELECT name,cover,ID,average FROM film  WHERE type=? ORDER BY average DESC LIMIT 5`,
          [series]
        );
        const [result7] = await conn.query(
          `SELECT name,cover,ID,average FROM film  WHERE type=? ORDER BY comment_count DESC LIMIT 5`,
          [series]
        );
        const [result8] = await conn.query(
          `SELECT ID,name,role,avatar FROM artists ORDER BY award_count LIMIT 4`
        );
        res.render("index/main", {
          user: req.session.user,
          movie_slide: result1,
          new_movies: result2,
          top_movies: result3,
          most_reviews_movies: result4,
          new_series: result5,
          top_series: result6,
          most_reviews_series: result7,
          spotlight_artists: result8,
        });
      })();
    } catch (error) {
      console.log(error);
    }
  });

  app.use("/video", video);
  app.use("/artist", artists);
  app.use("/user", [userAuth, user]);

  app.get("/login", (req, res) => {
    if (req.session.Admin) {
      res.redirect("/admin");
    } else {
      res.render("admin/login");
    }
  });

  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("back");
  });

  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    conn
      .query("SELECT * FROM admin WHERE email = ? AND password = ?", [
        email,
        password,
      ])
      .then(([result]) => {
        if (result.length > 0) {
          req.session.Admin = {
            id: result[0].ID,
            name: result[0].name,
            email: result[0].email,
          };
          res.redirect("/admin");
        } else {
          res.render("regMessage", {
            headertext: "",
            message: "the username or password is invalid.",
          });
        }
      })
      .catch((err) => {
        res.render("regMessage", {
          headertext: "there was an error",
          message: "there was an error",
        });
        console.log(err);
      });
  });

  app.post("/userLogin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    conn
      .query("SELECT * FROM user WHERE username = ? AND password = ?", [
        username,
        password,
      ])
      .then(([result]) => {
        if (result.length > 0) {
          req.session.user = {
            name: result[0].name || username,
            id: result[0].ID,
            banned: result[0].banned,
            avatar: result[0].avatar,
          };
          res.redirect("back");
        } else {
          res.render("regMessage", {
            headertext: "",
            message: "the username or password is invalid.",
          });
        }
      })
      .catch((err) => {
        res.render("regMessage", {
          headertext: "there was an error",
          message: "there was an error",
        });
        console.log(err);
      });
  });

  app.post("/register", (req, res) => {
    const name = req.body.username;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if (!name || !email || !password || !username) {
      res.render("regMessage", {
        headertext: "fill all the fields",
        message: "please fill all the required fields",
      });
      return;
    }
    //TODO: hash the password

    //TODO: generate a gravatar image link
    conn
      .query(
        "INSERT INTO `user` (`email`, `password`, `name` , `username`) VALUES (? , ? , ? , ?)",
        [email, password, name, username]
      )
      .then(([row, fields]) => {
        res.render("regMessage", {
          headertext: "Account Created!",
          message: "the creation of account was successful!",
        });
      })
      .catch((err) => {
        res.render("regMessage", {
          headertext: "Account Already Exists",
          message:
            "there was a problem in creating your account. check if acount already exists.",
        });
        console.log(err);
      });
  });
  app.use((req, res, next) => {
    res.status(404).render("index/page404");
  });
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
}

// authenticate user
function auth(req, res, next) {
  if (req.session.Admin) {
    next();
  } else {
    res.redirect("/login");
  }
}

function userAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

run();
