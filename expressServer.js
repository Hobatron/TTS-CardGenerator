const express = require('express');
var entry = require('./generators/TileGen/generateTiles').entry;
const app = express()
var args = process.argv.slice(2);
var port = args[args.findIndex(function (s) { return s == '-port'; }) + 1];

entry();

app.get('/', (req, res) => {
  res.sendFile('E:/TTS-Game/New folder/TTS-CardGenerator/index.html');
})

var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40510})

app.get('/testing-tile-gen.png', (req, res) => {
  res.sendFile('E:/TTS-Game/testing-tile-gen.png');
})


process.once('SIGINT', async (signal) => {
  await wss.clients.forEach(ws => ws.send('test'));
})

server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})