const express = require('express');
const pool = require('../modules/pool');
const jwtCheck = require('../modules/jwtCheck');

const router = express.Router();

router.get('/', jwtCheck, (req, res) => {
    console.log('in GET route')
    //res.send({responseKey: 'Server works!'})
    let queryText = `SELECT * FROM "pictures";`;
    pool.query(queryText)
        .then((result) => {
            console.log(result.rows)
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error on query ${error}`);
            res.sendStatus(500);
        });
})

module.exports = router;