const express = require('express');
const pool = require('../modules/pool');
const jwtCheck = require('../modules/jwtCheck');

const router = express.Router();

router.put('/', jwtCheck, (req, res) => {
    console.log('in users PUT route')

    const queryText = `UPDATE "users"
                       SET "favorite_image_url" = $1
                       WHERE "id" = $2;`;
    pool.query(queryText, [req.body.image_url, req.user.sub])
        .then((response) => {
            console.log('UPDATE favorite_image_url successful')
        })
        .catch((error) => {
            console.log('error in update favorite query:', error)
        })
});
    // let queryText = `SELECT * FROM "pictures";`;
    // pool.query(queryText)
    //     .then((result) => {
    //         console.log(result.rows)
    //         res.send(result.rows);
    //     })
    //     .catch((error) => {
    //         console.log(`Error on query ${error}`);
    //         res.sendStatus(500);
    //     });


module.exports = router;

// https://vibecheque.s3.us-east-2.amazonaws.com/1581982941666?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIGVJ3GVPRXRY4THQ%2F20200217%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20200217T234223Z&X-Amz-Expires=604800&X-Amz-Signature=4c893dc6cd9ed0980b36047c016acce3b2fc3f4279a39e9f80e34986cebffcdf&X-Amz-SignedHeaders=host%27
// https://vibecheque.s3.us-east-2.amazonaws.com/1581982941666?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIGVJ3GVPRXRY4THQ%2F20200217%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20200217T234223Z&X-Amz-Expires=604800&X-Amz-Signature=4c893dc6cd9ed0980b36047c016acce3b2fc3f4279a39e9f80e34986cebffcdf&X-Amz-SignedHeaders=host