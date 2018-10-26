const express = require('express');
const app = express();

const port = process.env.port || 5000;
const routes = require('./routes');

/* GET home page. */
// app.get('/', function (req, res, next) {
//     res.send('Server up and running');
// });

app.use('/', routes);
app.listen(port, () => {
    console.log('server up and running on port', port);
});