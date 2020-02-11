const express = require('express');
const pool = require('../modules/pool');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(bodyParser.json());

const users = [
    {id: 1, username: "clarkKent", password: "superman", favorite_photo_url: "superman_url", is_banned: false},
    {id: 2, username: "bruceWayne", password: "batman", favorite_photo_url: "batman_url", is_banned: false},
    {id: 3, username: "Russ", password: "Plus", favorite_photo_url: "https://www.thespruceeats.com/thmb/64k5P_k2qFJCa0tjuXIrZ4yDlU8=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/aqIMG_1498fsq-5b343910c9e77c001a218bd0.jpg", is_banned: false}
  ];

// router.post('/', (req, res) => {
//     console.log('req.body:', req);
//     const user = req.body.username;
//     res.status(200).send(`User's name is ${user}`);
// })

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
            const user = users.find((u) => {
                return u.username === req.body.username && u.password === req.body.password;
            });
            if (!user) {
                console.log('user not found')
                res.status(401).send("Error. Username/password not found.");
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