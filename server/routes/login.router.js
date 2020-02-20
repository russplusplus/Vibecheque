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
            // const user = users.find((u) => {
            //     return u.username === username && u.password === password;
            // });

            // finds user in database based on username
            const user = users.find((u) => {
                return u.username === username
            });
            
            console.log(req.body.password)
            console.log(user.password)
            
            let match = encryptLib.comparePassword(req.body.password, user.password)
            console.log('If passwords match, this should be true:', match)
            console.log('user:', user)
            if (!match) {
                console.log('incorrect password')
                res.status(401).send('Password is incorrect.')
                return;
            }
            if (!user) {
                console.log('user not found')
                res.status(401).send('Error. Username/password not found.');
                return;
            }
            if (user.is_banned) {
                console.log('banned user tried to login')
                res.status(403).send('User is banned.')
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