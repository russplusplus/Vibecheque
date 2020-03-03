const express = require('express');
const pool = require('../modules/pool');
const bodyParser = require('body-parser');
const jwtCheck = require('../modules/jwtCheck');

const router = express.Router();

router.use(bodyParser.json());

router.post("/", jwtCheck, (req, res) => {
    console.log('in images GET route')
    console.log('req.body:', req.body)
    console.log('req.user:', req.user)
    
    // Get array of user ids to randomly select recipient from
    const getUsersQueryText = `SELECT "id" from "users";`;
    pool.query(getUsersQueryText)
        .then((response) => {
            console.log('user id array:', response.rows)
            const users = response.rows;
            const usersIdArray = [];
            for (user of users) {    //ARRAY_AGG might make this part simpler
                usersIdArray.push(user.id)
            }

            let recipientId;
            let isResponse = false;
            console.log('req.body.recipientId:', req.body.recipientId)
            if (req.body.recipientId) {
                recipientId = req.body.recipientId;
                isResponse = true;
            } else {
                do {
                    recipientId = usersIdArray[Math.floor(Math.random() * usersIdArray.length)];
                    console.log('recipientId:', recipientId);
                    console.log('req.user.sub:', req.user.sub);
                } while (recipientId == req.user.sub);
            }
            
            
            const insertImageQueryText = `INSERT INTO "images" ("image_url", "from_users_id", "to_users_id", "is_response")
                                          VALUES ($1, $2, $3, $4);`;
            pool.query(insertImageQueryText, [req.body.url, req.user.sub, recipientId, isResponse])
                .then((response2) => {
                    console.log('Query successful!')
                })
                .catch((error) => {
                    console.log('Query error:', error)
                })
        })
    res.send({"testurl":"www.com"})
})

router.get("/", jwtCheck, (req, res) => {
    console.log(req.user.sub)
    const getInboxQuery = `SELECT * FROM "images"
                           WHERE "to_users_id" = $1;`;
    pool.query(getInboxQuery, [req.user.sub])
        .then((response) => {
            console.log('in images get')
            res.send(response.rows);
        })
        .catch((error) => {
            console.log('error in images get')
        })
})

router.delete("/", jwtCheck, (req, res) => {
    console.log('in DELETE images')
    console.log('req.body.imageId:', req.body)
    const deleteViewedImageQuery = `DELETE FROM "images"
                                    WHERE "id" = ${req.body.imageId};`;
    pool.query(deleteViewedImageQuery)
        .then((response) => {
            console.log('images delete returned')
        })
        .catch((error) => {
            console.log('error in delete image:', error)
        })
})

module.exports = router;