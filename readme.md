## Installation

Follow these instructions to install canvas: https://github.com/Automattic/node-canvas/wiki/Installation:-Windows
Note: I had to downgrade my node version to the latest 15, as of writing this it's the latest version of node supported by Canvas

```bash
npm i
```
```bash
npm i -g nodemon
```
```bash
npm run start
```

Open browser to http://localhost:8124/ (should display in console to ctrl click)

Notable issues that I don't care enough to fix:
1. You have to save files twice. I don't get why nodemon does a fresh reload of files every second restart, but it works.
2. I'm sure there's a much better and easier way to show live updates of the image, I just couldn't get anything to work.
3. There's probably a decent amount of unused code already

Planned improvments:
1. The whole point is to import a csv and create cards from that, no I don't think lorem ipsum makes good cards
2. Image import per card
3. Better text boxes