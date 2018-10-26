const express = require('express');
const app = express();
const routes = require('./routes');

/* GET home page. */
app.get('/', function (req, res, next) {
    res.send('Server up and running');
});

app.listen(7070, () => {
    console.log('server up and running');
});