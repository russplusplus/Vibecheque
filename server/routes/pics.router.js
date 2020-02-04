const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('in GET route')
    res.send({responseKey: 'Server works!'})
})

module.exports = router;