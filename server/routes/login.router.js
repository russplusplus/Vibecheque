const express = require('express');
const pool = require('../modules/pool');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const encryptLib = require('../modules/encryption');

const router = express.Router();

router.use(bodyParser.json());

router.post("/", (req, res) => {
    console.log(req.body)
    console.log('username:', req.body.username, 'password:', req.body.password)

    if (!req.body.username || !req.body.password) {
      res.status(400).send("Error. Please enter the correct username and password");
      return;
    }
    
    const queryText = `SELECT * FROM USERS;`;
    pool.query(queryText)
        .then((response) => {
            let users = response.rows;
            const username = req.body.username;
            const password = encryptLib.encryptPassword(req.body.password);
            console.log('input username:', username);
            console.log('input password:', password);
            
            const user = users.find((u) => {
                return u.username === username
            });
            if (!user) {
                console.log('user not found')
                res.status(401).send('{"errorMessage":"User not found."}');
                return;
            }
            
            let match = encryptLib.comparePassword(req.body.password, user.password)
            console.log('If passwords match, this should be true:', match)
            console.log('user:', user)
            
            if (!match) {
                console.log('incorrect password')
                res.status(401).send('{"errorMessage":"Password is incorrect."}');
                return;
            }
            if (user.is_banned) {
                console.log('banned user tried to login')
                res.status(403).send('{"errorMessage":"You have been banned for spreading bad vibes."}');
                return;
            }
            const token = jwt.sign({
                sub: user.id,
                username: user.username
            }, "mykey", {expiresIn: "3 hours"});
            res.status(200).send({access_token: token})
        }).catch((error) => {
            console.log('login GET users error:'. error)
        })
})

module.exports = router;