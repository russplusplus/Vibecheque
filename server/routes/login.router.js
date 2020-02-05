const express = require('express');
const pool = require('../modules/pool');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

const users = [
    {id: 1, username: "clarkKent", password: "superman"},
    {id: 2, username: "bruceWayne", password: "batman"}
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
})

module.exports = router;