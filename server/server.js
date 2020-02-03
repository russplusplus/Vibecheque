const express = require('express');
const app = express();
// const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

// Route includes
const picsRouter = require('./routes/pics.router');

/** ---------- MIDDLEWARE ---------- **/
app.use(bodyParser.json()); // needed for angular requests
app.use(express.static('build'));
// app.use(cors({origin: true, credentials: true}));

/** ---------- ROUTES ---------- **/
app.use('/pics', picsRouter);

/** ---------- START SERVER ---------- **/
app.listen(port, function () {
    console.log('Listening on port: ', port);
});