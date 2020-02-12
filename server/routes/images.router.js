const express = require('express');
const pool = require('../modules/pool');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());


router.get("/", (req, res) => {
    res.send({"testurl":"www.com"})
    
})

router.post("/", (req, res) => {
    
})

module.exports = router;