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
    ctx.font = `${fontSize}px "Icon Pack"`;
    if (cost[cost.length - 1] == '+') {
        ctx.font = `${fontSize}px "Liberation Mono"`
        ctx.fillStyle = '#000';
        ctx.fillText(cost, x+80+fontSize, y+80+fontSize)
    } else if (!isNaN(parseInt(cost))) {
            ctx.fillStyle = '#D4AF37';
            ctx.fillText("B", x+80+fontSize, y+80+fontSize);
            ctx.font = `${fontSize}px "Liberation Mono"`
            ctx.fillStyle = '#000';
            ctx.fillText("x" + cost, x+80+fontSize*2, y+80+fontSize);
    } 
}

//(width/2-txtOffSet/2) - centered text
// let txtOffSet = text.length * fontWidth;
function addRulesText(ctx, x, y, text) {
    let words = text.split(' ');
    let letterCount = 0;
    let row = 0;    
    for (let i = 0; i < words.length; i++) {
        
    }
}

//OLD DELETE WHEN NO LONGER NEEDED
//let text = ipsum('s3$120'); //this is temp text
    // let words = text.split(' ');
    // let strRows = ['', '', '', '', '', '', '', '', '']; //Add more/less to add or remove rows
    // let letterCount = 0;
    // let row = 0;
    // for (let i = 0; i < words.length; i++) {
    //     const word = words[i] + ' ';
    //     if (word.charAt(0) == "{") {
    //         letterCount += writeSymbol(x,y,letterCount,row, word);
    //     } else {
    //         letterCount += word.length;
    //     }
    //     if (letterCount - 1 <= maxLettersPerRow) {
    //         strRows[row] += `${word}`;
    //     } else {
    //         row++;
    //         letterCount = word.length;
    //         strRows[row] += `${word}`;
    //     }
    // }

    // for (let i = 0; i < strRows.length; i++) {
    //     ctx.font = `${fontSize}px "Liberation Mono"`
    //     ctx.fillStyle = '#000';
    //     if(strRows[i].includes('undefined')) throw new Error(`Rules text out of bounds: ${text}`);
    //     ctx.fillText(strRows[i], x+rulesTextBox.x, y+rulesTextBox.y+i*(fontSize+10));
    // }

    // function writeSymbol(x, y, letterCount, row, word) {
    //     ctx.font = `${fontSize}px "Icon Pack"`;
    //     const key = word.split('{')[1].split(':')[0];
    //     let value = word.split(':')[1].split('}')[0]
    //     switch(key) {
    //         case "Gem": {
    //             value = value.split('-');
    //             for (let i = 0; i < value.length; i++) {
    //                 switch(value[i]) {
    //                     case 'R':
    //                         ctx.fillStyle = '#F00';
    //                         break;
    //                     case 'G':
    //                         ctx.fillStyle = '#0F0';
    //                         break;
    //                     case 'B':
    //                         ctx.fillStyle = '#00F';
    //                         break;
    //                     default:
    //                         ctx.fillStyle = '#FFF';
    //                         break;
    //                 }
    //                 ctx.fillText("C", x+rulesTextBox.x+fontSize*5, y+rulesTextBox.y+(row)*(fontSize+10));
    //             }
    //         }
    //     }
    //     return value.length;
    // }
    

module.exports.entry = entry;