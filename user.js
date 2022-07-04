const express = require("express")
const router = express.Router()
const mysql = require("mysql2");
const conn = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
})
router.get("/profile", (req, res) => {
    const id = req.session.user.id
    conn.query(`SELECT * FROM user WHERE ID=?`, [id], (err, result, field) => {
        if (err) {
            console.log(err)
        } else {

            res.render("user/profile", { information: result[0] })
        }
    })
})
router.get("/userrate", (req, res) => {
    const id = req.session.user.id
    try {
        (async () => {
            const [result1] = await conn.promise().query(`SELECT * FROM user WHERE ID=?`, [id]);
            const [result2] = await conn.promise().query(`SELECT film.name,film.year,film.cover,comment.text,comment.date FROM comment INNER JOIN film WHERE comment.User_ID=? AND comment.Movie_ID=film.ID`, [id]);
            const [result3] = await conn.promise().query(`SELECT COUNT(comment.text) AS COCO FROM comment INNER JOIN film WHERE comment.User_ID=? AND comment.Movie_ID=film.ID`, [id]);
            const [result4] = await conn.promise().query(`SELECT film.name,film.year,film.cover,stars.Rating FROM stars INNER JOIN film WHERE stars.User_ID=? AND stars.Movie_ID=film.ID`, [id]);
            const [result5] = await conn.promise().query(`SELECT COUNT(stars.Rating) AS COST FROM stars INNER JOIN film WHERE stars.User_ID=? AND stars.Movie_ID=film.ID`, [id]);
            res.render("user/userrate",
                {
                    information: result1[0],
                    commentsmovies: result2,
                    comment_count: result3[0].COCO,
                    ratesmovies: result4,
                    rate_count: result5[0].COST

                })
        })();

    } catch (error) {
        console.log(error)
    }





})


router.post("/profile", (req, res) => {
    // update user profile
    const ID = Number.parseInt(req.session.user.id)
    const name = req.body.name
    const avatar = req.body.avatar
    const queryobj = getUpdateQuery(name, avatar, ID)
    if (name || avatar) {
        conn.query(queryobj.query, queryobj.items, (err, result) => {//avatar ham mitone avaz kone 
            if (err) {
                console.log(err)
            } else {
                res.redirect("/user/profile")

            }
        })
    } else {
        res.render("regMessage", {
            headertext: "",
            message: "the username or password is invalid."
        })
    }


})

router.post("/profile/changepass", (req, res) => {
    const ID = Number.parseInt(req.session.user.id)
    const oldpassword = req.body.oldpassword
    const newpassword = req.body.newpassword
    const cnewpassword = req.body.cnewpassword
    const old = '';
    conn.query(`SELECT password FROM user WHERE  ID=?`, [ID], (err, result) => {
        if (err) {
            console.log(err)
        } else {

            if (result[0].password !== oldpassword) {
                console.log('not equal oldpass')
                res.render("regMessage", {
                    headertext: "",
                    message: "the old password is incorrect!"
                })

            } else {
                if (newpassword !== cnewpassword) {
                    console.log('not equal cnew ')
                    res.render("regMessage", {
                        headertext: "",
                        message: "the new password not equal with Confirm password!"
                    })
                } else {
                    conn.query(`UPDATE user SET password=? WHERE ID=?`, [newpassword, ID], (err1, result1) => {
                        if (err1) {
                            console.log(err1)
                        } else {
                            res.redirect("/user/profile")
                        }
                    });
                }
            }

        }
    });
})

router.get("/profile/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

function getUpdateQuery(name, avatar, ID) {
    let query = "UPDATE user SET "
    const items = [{ item: ["name", name] }, { item: ["avatar", avatar] }];

    const result = items.filter((current) => {
        return current.item[1]
    })
    let resultItems = [];
    if (result.length > 0) {
        result.forEach(object => {
            query += object.item[0] + "=? "
            resultItems.push(object.item[1])
        })
        query += "WHERE ID=?";
        resultItems.push(ID)
    }

    return { query: query, items: resultItems };

}

module.exports = router;






// SELECT film.name,film.year,comment.text,comment.date,stars.Rating `+
// `FROM comment INNER JOIN stars INNER JOIN film ON comment.User_ID=stars.User_ID AND comment.Movie_ID=film.ID AND `+
// `stars.Movie_ID=film.ID AND comment.Movie_ID=stars.Movie_ID