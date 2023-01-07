const fs = require('fs');
const findHexagonCenter = require('./centerFinder.js').findHexagonCenter;
const { createCanvas, loadImage, registerFont } = require('canvas');
const csv = require('fast-csv');
const filename = 'testing-tile-gen'

// uv map size in px
const width = 1024;
const height = width;
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d');
//magic number found by measuring pixels and dividing by width
const sideLength = width / 7.420289855072464

//testing my func
// const testPos = [
//     {
//         x: 275.99003575224043,
//         y: 904.4942471388738
//     },
//     {
//         x: 206,
//         y: 785
//     }
// ]

//bottom left point
const backInitPos = [   
    {    
        x: 0,
        y: height - (Math.round((sideLength * Math.sin(60/(180/Math.PI))) * 10) / 10)
    },
    {    
        x: Math.round((sideLength * Math.sin(30/(180/Math.PI))) * 10) / 10,
        y: height
    },
]


//bottom right point
const frontInitPos = {
    // x: Math.round((width - Math.sin(30/(180/Math.PI)) * sideLength) * 10) / 10,
    x: 0,
    y: height
}
ctx.strokeStyle = 'rgba(0,0,0,1)'

function entry() {
    drawBack(findHexagonCenter(backInitPos, true));
}

function drawBack(startingCenter) { 
    //#region DrawBack
    //draw back
    let head = {
        x: 0,
        y: startingCenter.y
    }
    ctx.lineWidth = 20;
    let angle = Math.PI / 3; // 60 degrees
    ctx.beginPath();
    ctx.moveTo(startingCenter.x + sideLength  * Math.cos(angle) , startingCenter.y + sideLength  * Math.sin(angle) )

    for (let i = 1; i <= 7; i++) {
        console.log(startingCenter.x + sideLength * Math.cos(angle * i), startingCenter.y + sideLength * Math.sin(angle * i));
        ctx.lineTo(
            startingCenter.x + sideLength * Math.cos(angle * i), 
            startingCenter.y + sideLength * Math.sin(angle * i)
        );
    }
    ctx.stroke();
    // #endregion

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./${filename}.png`, buffer);
}
module.exports.entry = entry;