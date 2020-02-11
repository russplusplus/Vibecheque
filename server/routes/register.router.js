const express = require('express');
const pool = require('../modules/pool');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(bodyParser.json());

router.post("/", (req, res) => {
    console.log(req.body)
    console.log('username:', req.body.username, 'password:', req.body.password)

    // const GETQueryText = `SELECT "username" from "users";`;
    // console.log('in register GET')
    // pool.query(GETQueryText)
    //     .then((response) => {
    //         console.log('register GET successful');
    //         users = response.rows;

            // const user = users.find((u) => {
            //     return u.username === req.body.username;
            // });
        
            // if (user) {
            //     console.log('username taken')
            //     res.status(401).send("Error. Username already taken.");
            //     return;
            // }
        //     console.log('.then users:', users)
        // }).catch((error) => {
        //     console.log('error in register GET:', error);
        // })    

    let POSTQueryText = `INSERT INTO "users" ("username", "password")
                        VALUES ('${req.body.username}', '${req.body.password}');`;
    pool.query(POSTQueryText)
        .then((response) => {
            console.log('register query response:', response)
        }).catch((error) => {
            console.log('register error:', error);
        });
})

module.exports = router;