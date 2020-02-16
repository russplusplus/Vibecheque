require('dotenv').config();
const AWS = require('aws-sdk');

// Configuring AWS
AWS.config = new AWS.Config({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: process.env.BUCKET_REGION
});

// Creating a S3 instance
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: 'us-east-2'
});

const Bucket = process.env.BUCKET_NAME;

function generateGetUrl(Key) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket,
            Key,
            Expires: 604800 // 1 week, max value
        };
        s3.getSignedUrl('getObject', params, (err,url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
}

function generatePutUrl(Key, ContentType) {
    return new Promise((resolve, reject) => {
        const params = { Bucket, Key, ContentType };

        s3.getSignedUrl('putObject', params, function(err, url) {
            if (err) {
                reject(err);
            }
            resolve(url);
        });
    });
}

module.exports = { generateGetUrl, generatePutUrl };