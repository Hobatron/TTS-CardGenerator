const express = require('express');
const open = require('open');
var testingImageGen = require('./generateCards').testingImageGen;
const app = express()
const livereload = require('livereload')
const connectLivereload = require("connect-livereload");

app.use(connectLivereload());
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'))

server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
})