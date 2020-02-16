const express = require('express');
const pool = require('../modules/pool');
const bodyParser = require('body-parser');
const jwtCheck = require('../modules/jwtCheck');

const router = express.Router();

router.use(bodyParser.json());

router.get("/", jwtCheck, (req, res) => {
    let queryText = `SELECT "favorite_photo_url" FROM "users"
                     WHERE "id" = $1;`;
    pool.query(queryText, [req.user.sub])
        .then((response) => {
            console.log(response.rows)
            res.send(response.rows);
        })
        .catch((error) => {
            console.log('error in favorite query:', error);
        })
    
})

module.exports = router;