var form = document.getElementById('form');

var firstCont = document.getElementById('firstCont');
var lastCont = document.getElementById('lastCont');

var contentOptions = document.getElementsByClassName('content-options')[0];
var options = document.getElementsByClassName('options')[0];
var btCloseOption = document.getElementById('closeOption');
var optionsRadio = document.querySelectorAll('[type="radio"]')
var btReverse = document.getElementById('btReverse')
var firstColorDiv = document.getElementById('firstColorDiv');
var lastColorDiv = document.getElementById('lastColorDiv');
var resulColor = document.getElementById('resulColor');
var colorInput = document.getElementById('colorInput');
var errorLog = document.getElementById('errorLog');
var btcupy = document.getElementById('btcupy');

let firstColor = {
    color: '',
    type: '#',
    option: 1,
}
let lastColor = {
    color: '',
    type: 'RGB',
    option: 2,
}

let placeholder = {
    h: '#ffffff',
    rgb: 'rgba(255, 255, 255)',
    hsl: 'hsl(380 100% 33%)'
}

function optionsColor(e, obj,input) {
    optionsRadio.forEach(item => {
        item.removeAttribute('checked');
        item.checked = false;
    });

    // Set the previously selected option
    optionsRadio.forEach(item => {
        if (item.value == obj.option) {
            item.setAttribute('checked', '');
            item.checked = true;
        }
    });

    optionsRadio.forEach(item => {
        item.onclick = (e) => {
            if(e.target.value !== obj.type ){
                input.value = ''
                lastColorDiv.style.backgroundColor = 'transparent'

            }
            obj.option = parseInt(e.target.value);
            obj.type = e.target.nextElementSibling.textContent

            optionsRadio.forEach(item => {
                item.removeAttribute('checked');
            });
            e.target.setAttribute('checked', '');
        }
    });
}

firstCont.onclick = (e) => {
    e.preventDefault()
    contentOptions.style.display = 'flex';
    optionsColor(e, firstColor, colorInput)
}

lastCont.onclick = (e) => {
    e.preventDefault()
    contentOptions.style.display = 'flex';
    optionsColor(e, lastColor, resulColor)
}
colorInput.oninput = (e) => {
    e.preventDefault()
    firstColorDiv.style.backgroundColor = `${e.target.value}`
}

btCloseOption.onclick = (e) => {
    e.preventDefault()
    contentOptions.style.display = 'none';
    firstCont.children[0].textContent = firstColor.type;
    lastCont.children[0].textContent = lastColor.type;
}

let booteamReverse = true
let tempLast = {}
let tempFirst = {}
btReverse.onclick = () => {
    if (booteamReverse) {
        tempLast = lastColor
        tempFirst = firstColor

        lastColor = tempFirst
        firstColor = tempLast
        booteamReverse = false
    } else {
        firstColor = tempFirst
        lastColor = tempLast
        booteamReverse = true
    }

    firstCont.children[0].textContent = firstColor.type;
    lastCont.children[0].textContent = lastColor.type;
    resulColor.value = ''
    colorInput.value = ''
    firstColorDiv.style.backgroundColor = 'transparent'
    lastColorDiv.style.backgroundColor = 'transparent'
}

form.onsubmit = (e) => {
    e.preventDefault();
    const dataFrom = new FormData(e.target)
    const data = Object.fromEntries(dataFrom.entries())
    if (colorInput.value) conversionColor(data.color)
}

btcupy.onclick = async () => {
    if(resulColor){
        await navigator.clipboard.writeText(resulColor.value)
    }   
}

const patroHexa = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
const patronRGB = /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/;
const patronHSL =  /^hsl\(\s*(\d{1,3})\s* \s*(\d{1,3})%?\s* \s*(\d{1,3})%?\s*\)$/;

let convertedColor = ''
let booleanLog = true
let booleanSintaxi = false
const conversionColor = (color) => {
    console.log('First color:', firstColor.option)
    console.log('Last color:', lastColor.option)
    // # -> RBG
    if (firstColor.option === 1 && lastColor.option === 2) {
        if (color.match(patroHexa)) {
            convertedColor = hexConvertRGB(color).rgb
        }else{
            booleanSintaxi = true;
        }
    }

    // RBG -> # 
    if (firstColor.option === 2 && lastColor.option === 1) {
        if(color.match(patronRGB)){
            color = color.replace(/^rgb\(|\)$/g, '').split(',');
            convertedColor = rgbConvertHex(...color)
        }else{
            booleanSintaxi = true;
        }
    }

    // # -> HSL
    if (firstColor.option === 1 && lastColor.option === 3) {
        if(color.match(patroHexa)){
            convertedColor = hexConvertRGB(color)
            convertedColor = rgbConvertHSL(convertedColor.r, convertedColor.g, convertedColor.b)
        }else{
            booleanSintaxi = true;
        }
    }

    // HSL -> #
    if (firstColor.option === 3 && lastColor.option === 1) {
        if(color.match(patronHSL)){
            color = (color.replace(/^hsl\(|\)$/g, '').replace(/%/g, '').split(' '));
            convertedColor = hslConverRGB(...color)
            convertedColor = rgbConvertHex(convertedColor.r, convertedColor.g, convertedColor.b)
        }else{
            booleanSintaxi = true;
        }
    }

    // RGB -> HSL
    if (firstColor.option === 2 && lastColor.option === 3) {
        if(color.match(patronRGB)){
            color = color.replace(/^rgb\(|\)$/g, '').split(',');
            convertedColor = rgbConvertHSL(...color)
        }else{
            booleanSintaxi = true;
        }
    }

    // HSL -> RGB
    if (firstColor.option === 3 && lastColor.option === 2) {
        console.log('color',color)
        if(color.match(patronHSL)){
            color = (color.replace(/^hsl\(|\)$/g, '').replace(/%/g, '').split(' '));
            convertedColor = hslConverRGB(...color).rgb
        }else{
            booleanSintaxi = true;
        }
    }

    if (convertedColor) {
        console.log(convertedColor)
        lastColorDiv.style.backgroundColor = convertedColor
        resulColor.value = convertedColor
        convertedColor = ''
    }else{
        if(booleanLog){
            console.log('error')
            errorLog.textContent = booleanSintaxi? 'Error de sintaxis': `No es posible hacer la conversion`
            // errorLog.style.animation = 'errorlog 0.2s both ease-in-out'
            errorLog.classList.add('errorclick')
            booleanLog = false
            booleanSintaxi = false
            setTimeout(() =>{
                errorLog.classList.toggle('errorclick')
                booleanLog = true
            },2000)   
        }
    }
}

const hexConvertRGB = (color) => {
    hexadecimal = color.replace(/^#/, '');
    if (hexadecimal.length === 3) {
        hexadecimal = hexadecimal.split('').map(char => char + char).join('');
    }

    let r, g, b;
    if (hexadecimal.length === 6) {
        r = parseInt(hexadecimal.substring(0, 2), 16)
        g = parseInt(hexadecimal.substring(2, 4), 16)
        b = parseInt(hexadecimal.substring(4, 6), 16)
    }

    return {
        r, g, b,
        rgb: `rgb(${r}, ${g}, ${b})`
    }
}
function rgbConvertHex(r, g, b) {
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    console.log(r, g, b)
    const resul = (hex) => {
        return hex.toString(16).padStart(2, '0')
    }

    return `#${resul(r)}${resul(g)}${resul(b)}`;
}

const rgbConvertHSL = (r, g, b) => {
    r = r / 255; g = g / 255; b = b / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    let h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = 0;
        s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const hslConverRGB = (h, s, l) => {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;

    let r, g, b;

    if (0 <= h && h < 60) {
        r = c; 
        g = x; 
        b = 0;

    } else if (60 <= h && h < 120) {
        r = x; 
        g = c; 
        b = 0;

    } else if (120 <= h && h < 180) {
        r = 0; 
        g = c; 
        b = x;

    } else if (180 <= h && h < 240) {
        r = 0; 
        g = x; 
        b = c;

    } else if (240 <= h && h < 300) {
        r = x;
        g = 0; 
        b = c;

    } else if (300 <= h && h < 360) {
        r = c; 
        g = 0; 
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return {
        r, g, b,
        rgb: `rgb(${r}, ${g}, ${b})`
    }
}
