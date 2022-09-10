const express = require('express');
const open = require('open');
var entry = require('./generateCards').entry;
const app = express()
var args = process.argv.slice(2);
var port = args[args.findIndex(function (s) { return s == '-port'; }) + 1];

entry();

app.get('/', (req, res) => {
  res.sendFile('C:/temp/index.html');
})

var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40510})

app.get('/cards.jpg', (req, res) => {
  res.sendFile('C:/temp/cards.jpg');
})

process.once('SIGINT', async (signal) => {
  await wss.clients.forEach(ws => ws.send('test'));
})

server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})