const fs = require('fs');
const findHexagonCenters = require('./helperMethods.js').findHexagonCenters;
const { createCanvas, loadImage, registerFont } = require('canvas');
const csv = require('fast-csv');
const filename = 'testing-tile-gen'

// uv map size in px
const width = 1024;
const height = width;
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d');
//magic number found by measuring pixels and dividing by width
const sideLength = width / 7.420289855072464;

const pieceOffSetY = height * .005;
const pieceOffSetX = height * .005;

const tileImages = {
    plains: {
        location: './tile-',
        loaded: false,
        data: {}
    },
    mountain: {
        location: './tile-',
        loaded: false,
        data: {}
    },
    lava: {
        location: './tile-',
        loaded: false,
        data: {}
    },
    water: {
        location: './tile-',
        loaded: false,
        data: {}
    },
    desert: {
        location: './tile-',
        loaded: false,
        data: {}
    },
    get allLoaded() {
        return this.plains.loaded &&
            this.mountain.loaded &&
            this.lava.loaded &&
            this.water.loaded &&
            this.desert.loaded
    }
}

let counter = 1;

//bottom left point
const backInitPos = [   
    {    
        x: (sideLength * Math.sin(30/(180/Math.PI)) + sideLength)  + pieceOffSetX,
        y: height - (sideLength * Math.sin(60/(180/Math.PI))) - pieceOffSetY
    },
    {    
        x: (sideLength * Math.sin(30/(180/Math.PI)) * 2 + sideLength) + pieceOffSetX,
        y: height - pieceOffSetY
    },
]

//bottom right point
const frontInitPos = [
    {    
        x: width - sideLength - sideLength * Math.sin(30/(180/Math.PI)) * 2 - pieceOffSetX,
        y: height - (sideLength * Math.sin(60/(180/Math.PI))) - pieceOffSetY
    },
    {    
        x: width - sideLength - sideLength * Math.sin(30/(180/Math.PI)) - pieceOffSetX,
        y: height - pieceOffSetY
    }
]

ctx.strokeStyle = 'rgba(0,0,0,1)'
ctx.fillStyle = '#e3e3e3';
ctx.fillRect(0, 0, width, height);

function entry() {
    loadImage('./tile-art/tile-back.png').then(image => {
        const pattern = ctx.createPattern(image, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
    });
    loadImages(() => {
        drawHexes();
    });
}

function loadImages(callBack) {
    for(let image in tileImages) {
        image = tileImages[image];
        if (image.location) {
            loadImage(image.location).then(data => {
                image.data = data;
                image.loaded = true;
                if (tileImages.allLoaded) {
                    callBack();
                }   
            });
        }
    }
}

function drawHexes() {
    drawHex(findHexagonCenters(backInitPos));
    drawHex(findHexagonCenters(frontInitPos));
}

function drawHex(centers) {
    //draw back
    ctx.lineWidth = 10;
    let angle = Math.PI / 3; // 60 degrees
    ctx.beginPath();
    centers.forEach((center, i) => {
        ctx.fillStyle = '#000';
        ctx.moveTo(center.x + sideLength  * Math.cos(angle) , center.y + sideLength  * Math.sin(angle) )
        ctx.beginPath();
        for (let i = 1; i <= 7; i++) {
            ctx.lineTo(
                center.x + sideLength * Math.cos(angle * i), 
                center.y + sideLength * Math.sin(angle * i)
            );
        }
        ctx.closePath();
        ctx.stroke();
        ctx.stroke();
        ctx.fillStyle = '#FF0000';
        ctx.font = '30px Arial'
        ctx.fillText(`${counter}`,center.x, center.y);
        counter++;
    });
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`../../${filename}.png`, buffer);
}
module.exports.entry = entry;