const express = require('express');
const bodyParser = require('body-parser');
const jwtCheck = require('../modules/jwtCheck');

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



router.get('/generate-get-url', jwtCheck, (req, res) => {
    console.log('in generate-get-url')
    const { Key } = req.query;
    generateGetUrl(Key)
        .then(getURL => {
            console.log(getURL)
            res.send({getURL: getURL});
        })    
        .catch(err => {
            res.send(err);
        });
});

router.get('/generate-put-url', jwtCheck, (req, res) => {
    console.log('in generate-put-url')
    const { Key , ContentType } = req.query;
    generatePutUrl(Key, ContentType)
        .then(putURL => {
            console.log('putURL:', putURL)
            res.send({putURL: putURL});
        })
        .catch(err => {
            res.send(err);
        });
});

module.exports = router;