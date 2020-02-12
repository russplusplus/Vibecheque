const express = require('express');
const bodyParser = require('body-parser');

const AWS = require('aws-sdk');
const cors = require('cors');

const router = express.Router();

router.use(express.json());
router.use(bodyParser.json());
router.use(cors());

// import { S3_KEY, S3_SECRET, BUCKET_NAME, BUCKET_REGION } from 'react-native-dotenv';

const {
    generateGetUrl,
    generatePutUrl
} = require('../modules/AWSPresigner');


// router.post('/', (req, res) => {
//     console.log('req.body:', req);
//     const user = req.body.username;
//     res.status(200).send(`User's name is ${user}`);
// })



router.get('/generate-get-url', (req, res) => {
    console.log('in generate-get-url')
    const { Key } = req.query;
    generateGetUrl(Key)
        .then(getURL => {
            console.log(getURL)
            res.send(getURL);
        })    
        .catch(err => {
            res.send(err);
        });
});

router.get('generate-put-url', (req, res) => {
    console.log('in generate-put-url')
    const { Key , ContentType } = req.query;
    generatePutUrl(Key, ContentType)
        .then(putURL => {
            console.log(putURL)
            res.send({putURL});
        })
        .catch(err => {
            res.send(err);
        });
});

module.exports = router;