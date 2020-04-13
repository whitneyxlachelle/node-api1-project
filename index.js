const express = require('express');

//created the server
const server = express();

server.get('/', (req, res) => {
    res.json({ message: " hello from your server!" });
});

server.listen(5000, () => {
    console.log('server started at port 5000')
});