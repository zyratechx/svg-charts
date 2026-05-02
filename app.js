const fs = require('fs');
const sharp = require('sharp');
const { ArgumentParser } = require('argparse')

const parser = new ArgumentParser({
    description: 'svg-chart-builder'
});
parser.add_argument('-o', '--output', {required: true})
parser.add_argument('-i', '--input', {required: true})
parser.add_argument('-t', '--type')

const args = parser.parse_args();
const output = args.output + '.svg'
const template = require('./' + args.input)

function Document() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="rgb(100,100,100)" fill-opacity="100%"/>
    <g transform="translate(97,51) scale(0.9)">
        <rect width="100%" height="100%" fill="none" stroke="white" stroke-width="2"/>
        <rect y="0" x="32.5%" width="35%" height="11%" fill="white" stroke="white" stroke-width="2"/>
        <rect stroke="white" y="94%" x="0%" width="15%" height="6%" fill="none" stroke-width="2"/>
        <text font-weight="900" font-size="55px" y="7%" x="50%" text-anchor="middle" fill="rgb(100,100,100)" font-family ="Russo One">${template.title}</text>
        <text x="310" y="85" text-anchor="middle" font-family="system-ui" font-size="50px">${template.labels.left}</text>
        <text x="1600" y="85" text-anchor="middle" font-family="system-ui" font-size="50px">${template.labels.right}</text>
        <rect stroke="white" y="94%" x="0%" width="100%" height="6%" fill="none" stroke-width="2"/>
        <rect y="0" x="0" width="100%" height="11%" fill="none" stroke="white" stroke-width="2"/>
        <rect stroke="white" y="94%" x="0%" width="100%" height="6%" fill="none" stroke-width="2"/>
        <rect stroke="white" y="94%" x="85%" width="15%" height="6%" fill="white"/>
        <text y="98%" x="92%" text-anchor="middle" font-family="russo one" font-size="40px" fill="rgb(100,100,100)">${template.unit.unit}</text>
        <text y="98%" x="3.4%" font-family="russo one" font-size="40px" fill="white">Legenda</text>
        <text y="98%" x="20%" font-family="russo one" fill="white" font-size="35px">${template.unit.first}</text>
        <rect width="2%" height="3.5%" y="95%" x="17%" fill="blue"/>
        <text y="98%" x="35%" font-family="russo one"  fill="white" font-size="35px">${template.unit.second}</text>
        <rect width="2%" height="3.5%" y="95%" x="32%" fill="rgb(0,0,200)"/>
        <g transform="translate(380,170) scale(0.7)">
            <rect width="100%" height="100%" fill="none"/>
            <g id="lines">
${renderLines()}
            </g>
        </g>
        <g transform="translate(0,180) scale(0.7)">
            <rect width="100%" height="100%" fill="none"/>
            <g>
${renderTexts()}
            </g>
        </g>
    </g>
</svg>`
}

let numItems = 0;
let x = 700
Object.values(template.page).forEach((items) => {
    numItems += 1;
    x = x - 100;
});
if (numItems > 4) {
    let m = numItems - 4
    x = x + (m * 50)
}
if (numItems === 8) {
    x = 150
}

function renderLines() {
    let lines_y_position = 0
    let lines_y2_position = 60
    let linesReturn = ``
    Object.values(template.page).forEach((item) => {
        linesReturn = linesReturn + `                <rect y="${lines_y_position}" x="0" width="${item.line1}%" height="60" fill="blue"/><rect y="${lines_y2_position}" x="0" width="${item.line2}%" height="60" fill="rgb(0,0,200)"/>\n`
        lines_y_position = lines_y_position + x
        lines_y2_position = lines_y2_position + x
    })
    return linesReturn
}

function renderTexts() {
    let text_y_position = 20
    let text_y2_position = 85
    let textReturn = ``
    Object.values(template.page).forEach((item) => {
        textReturn = textReturn + `                <text y="${text_y_position}" x="300" text-anchor="middle" dominant-baseline="middle" font-size="70px" font-family="russo one" font-weight="900">${item.name}</text> <text y="${text_y2_position}" x="300" dominant-baseline="middle" text-anchor="middle" font-size="60px" font-family="system-ui">${item.text}</text>\n`
        text_y_position = text_y_position + x
        text_y2_position = text_y2_position + x
    })
    return textReturn
}

if (numItems > 8) {
    console.log("ERROR 9 IS UNSUPPORTED")
} else {
    fs.writeFileSync('output/' + output, Document(), 'utf8');
}
console.log("INTEMS:", numItems , "\nPOSITION:", x)

if (args.type === "png") {
    sharp('output/' + output)
        .png()
        .toFile('output/' + args.output + '.png')
}
