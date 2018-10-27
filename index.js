const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;
const routes = require('./routes');



app.use(cors());
app.use('/', routes);
app.listen(port, () => {
    console.log('server up and running on port', port);
});