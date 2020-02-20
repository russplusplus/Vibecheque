const express = require('express');
const pool = require('../modules/pool');
const bodyParser = require('body-parser');
const encryptLib = require('../modules/encryption');

const router = express.Router();

router.use(bodyParser.json());

router.post("/", (req, res) => {
    const username = req.body.username;
    const password = encryptLib.encryptPassword(req.body.password);
    
    console.log(req.body)
    console.log('username:', username, 'password:', password)

    let POSTQueryText = `INSERT INTO "users" ("username", "password")
                         VALUES ($1, $2);`;
    pool.query(POSTQueryText, [username, password])
        .then((response) => {
            console.log('register query response:', response)
        }).catch((error) => {
            console.log('register error:', error);
        });
})

module.exports = router;