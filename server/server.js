const express = require('express');
const app = express();
// const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

const expressjwt = require("express-jwt");  //unsure about doing this in same server file. tutorial does this in separate fie for some reason

// Route includes
const picsRouter = require('./routes/pics.router');
const loginRouter = require('./routes/login.router');

/** ---------- MIDDLEWARE ---------- **/
app.use(bodyParser.json()); // needed for angular requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('build'));
// app.use(cors({origin: true, credentials: true}));

/** ---------- ROUTES ---------- **/
app.use('/pics', picsRouter);
app.use('/login', loginRouter);
/** ---------- START SERVER ---------- **/
app.listen(port, function () {
    console.log('Listening on port: ', port);
});