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

router.delete("/", jwtCheck, (req, res) => {
    console.log('in delete route')
    let queryText = `UPDATE "users"
                     SET "favorite_photo_url" = 'https://sanitationsolutions.net/wp-content/uploads/2015/05/empty-image.png'
                     WHERE "id" = $1;`;
    pool.query(queryText, [req.user.sub])
        .then((response) => {
            console.log('delete route returned')
        })
        .catch((error) => {
            console.log('error in delete route:', error);
        })
})

module.exports = router;