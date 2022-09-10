const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { radiusStroke } = require('./radiusStroke.js');
const { ipsum } = require('lorem');

//Card sizing
const cardRatio = 88/63
const width = 720;
const height = width*cardRatio;

//Canvas:
const cardCount = 69; //tts can do a max of 69 per sheet
const padding = 0; //set to 0 for tts
const cols = 10;
const rows = Math.ceil(cardCount/cols);
const insideConst = 48;

//Font
const fontSize = Math.floor(width * .05625);
const fontWidth = fontSize*.6; //Can make font slightly more dynamic/center w/ this value
const maxLettersPerRow = 23;
const canvas = createCanvas(width*cols+cols*padding-padding, height*rows+rows*padding-padding);
const rulesTextBox = {
    x:width*.1, //How far in % right the rules box starts
    y:height*.62 //How far in % down the rules box starts
}

const ctx = canvas.getContext('2d');

function entry() {
    registerFont('./LiberationMono-Bold.ttf', { family: 'Liberation Mono' });
    loadImages();
}

async function loadImages() {
    loadImage('./Chest (GameLiberty).png').then(image => {
        testingImageGen(image);
    })
}

async function testingImageGen(back) {

    let currentCard = 0;
    
    ctx.font = `${fontSize}px "Liberation Mono"`
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let y = i*height+i*padding;
            let x = j*width+j*padding;
            
            ctx.fillStyle = '#000';
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = '#FFF';
            radiusStroke(ctx, x+insideConst, y+insideConst, width-insideConst*2, height-insideConst*2);
            ctx.fillStyle = '#000';
            addRulesText(ctx, x, y, rulesTextBox)
            currentCard++;
            if (currentCard == cardCount) {
                j++
                ctx.drawImage(back, j*width+j*padding, y, width, height);
                break;
            }
        }
        if (currentCard == cardCount) {
            break; 
        }
    }
    
    const buffer = canvas.toBuffer('image/png');
    
    await fs.writeFileSync('./cards.jpg', buffer);
}
//(width/2-txtOffSet/2) - centered text
// let txtOffSet = text.length * fontWidth;
function addRulesText(ctx, x, y, rulesTextBox) {
    // let text = `This is a new card, generated from the card generater to see if I can add text and a bit more.`;
    let text = ipsum('s3$120');
    let words = text.split(' ');
    let strRows = ['', '', '', '', '', '', '']; //Add more/less to add or remove rows
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