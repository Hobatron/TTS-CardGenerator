const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { radiusStroke } = require('./radiusStroke.js');
const { ipsum } = require('lorem');
const csv = require('fast-csv');
let equipmentData = [];
let usablesData = [];

//Card sizing
const cardRatio = 88/63
const width = 720;
const height = width*cardRatio;

//Canvas:
let cardCount = 69; //tts can do a max of 69 per sheet
const sheetSize = 69; //tts can do a max of 69 per sheet
const padding = 0; //set to 0 for tts
const cols = 10;
const rows = Math.ceil(cardCount/cols);
const insideConst = width*.06;
const boarderRadius = width * .05;

//Font
const fontSize = Math.floor(width * .05625);
const fontWidth = fontSize*.6; //Can make font slightly more dynamic/center w/ this value
const maxLettersPerRow = 23;
const canvas = createCanvas(width*cols+cols*padding-padding, height*rows+rows*padding-padding);
const rulesTextBox = {
    x:width*.1, //How far in % right the rules box starts
    y:height*.4 //How far in % down the rules box starts
}

let currentCard = 0;

const ctx = canvas.getContext('2d');

function entry() {
    registerFont('./generators/CardGen/Tts_icons-Regular.ttf', { family: 'Icon Pack' });
    registerFont('./generators/CardGen/LiberationMono-Bold.ttf', { family: 'Liberation Mono' });
    fs.createReadStream('./generators/CardGen/equipmentCsv.csv')
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => equipmentData.push(row))
        .on('end', () => {
            cardCount = equipmentData.length;
            loadImages('./generators/CardGen/Chest (GameLiberty).png', 'equipment', equipmentData);
        });
    fs.createReadStream('./generators/CardGen/usablesCsv.csv')
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => usablesData.push(row))
        .on('end', () => {
            cardCount = usablesData.length;
            console.log();
            loadImages('./generators/CardGen/Scroll (GameLiberty).png', 'useables', usablesData);
        });
}

async function loadImages(imageName, fileName,data ) {
    loadImage(imageName).then(image => {
        testingImageGen(image, fileName, data);
    })
}

async function testingImageGen(back, filename, data) {
    currentCard = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            try {
                ctx.font = `${fontSize}px "Liberation Mono"`
                let y = row*height+row*padding;
                let x = col*width+col*padding;
                
                //black rect, for boarder
                ctx.fillStyle = '#000';
                ctx.fillRect(x, y, width, height);
                //white rect w/ radius, for card face
                ctx.fillStyle = '#FFF';
                radiusStroke(ctx, x+insideConst, y+insideConst, width-insideConst*2, height-insideConst*2, boarderRadius);
                //text time!
                ctx.fillStyle = '#000';
                addRulesText(ctx, x, y, data[currentCard].Text);
                addCost(ctx, x, y, data[currentCard].Cost);
                currentCard++;
                if (currentCard == sheetSize) {
                    col++
                    console.log(back);
                    ctx.drawImage(back, col*width+col*padding, y, width, height);
                    break;
                }
            }
            catch (error) {
                console.log(error);
                console.log('Prev card: ' + (currentCard - 1), data[currentCard - 1])
                console.log('Current card: ' + currentCard, data[currentCard])
                return;
            }
        }
        if (currentCard == sheetSize) {
            break; 
        }
    }
    
    const buffer = canvas.toBuffer('image/png');
    
    await fs.writeFileSync(`./${filename}.jpg`, buffer);
}

function addCost(ctx, x, y, cost) {
    //cost = ['R', 'R', 'G', 'G', 'B']; 
    ctx.font = `${fontSize}px "Icon Pack"`;
    if (isNaN(parseInt(cost))) {
        for(let i = 0; i < cost; i++) {
            ctx.fillStyle = '#D4AF37';
            ctx.fillText("B", x+80+i*fontSize, y+80+fontSize);
        };
    } else if (cost[cost.length - 1] == '+') {
        ctx.font = `${fontSize}px "Liberation Mono"`
        ctx.fillStyle = '#000';
        ctx.fillText(cost, x+80+fontSize, y+80+fontSize);
    } else {
    //Old gem-cost code works with cost format 'R-G-B' -
        cost = cost.split('-');
        for (let i = 0; i < cost.length; i++) {
            switch(cost[i]) {
                case 'R':
                    ctx.fillStyle = '#F00';
                    break;
                case 'G':
                    ctx.fillStyle = '#0F0';
                    break;
                case 'B':
                    ctx.fillStyle = '#00F';
                    break;
                default:
                    ctx.fillStyle = '#FFF';
                    break;
            }
            ctx.fillText("C", x+80+i*fontSize, y+80+fontSize);
        }
    }
}

//(width/2-txtOffSet/2) - centered text
// let txtOffSet = text.length * fontWidth;
function addRulesText(ctx, x, y, text) {
    //let text = ipsum('s3$120'); //this is temp text
    let words = text.split(' ');
    let strRows = ['', '', '', '', '', '', '', '']; //Add more/less to add or remove rows
    let letterCount = 0;
    let row = 0;
    for (let i = 0; i < words.length; i++) {
        const word = words[i] + ' ';
        letterCount += word.length;
        if (letterCount - 1 <= maxLettersPerRow) {
            strRows[row] += `${word}`;
        } else {
            row++;
            letterCount = word.length;
            strRows[row] += `${word}`;
        }
    }

    for (let i = 0; i < strRows.length; i++) {
        if(strRows[i].includes('undefined')) throw new Error(`Rules text out of bounds: ${text}`);
        ctx.fillText(strRows[i], x+rulesTextBox.x, y+rulesTextBox.y+i*(fontSize+10));
    }
    
}

module.exports.entry = entry;