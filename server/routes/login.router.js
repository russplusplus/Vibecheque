const express = require('express');
const pool = require('../modules/pool');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());

router.post('/', (req, res) => {
    console.log('req.body:', req);
    const user = req.body.username;
    res.status(200).send(`User's name is ${user}`);
})

module.exports = router;