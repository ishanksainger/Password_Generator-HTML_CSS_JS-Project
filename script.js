const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn")
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
const symbols = ",.?;:'\"()[]{}<>-_/\\|&@#$%^*+=~";

handleSlider()

setIndicator("#ccc");

// set pwd length
function handleSlider() {
    passwordLength = parseInt(inputSlider.value, 10);
    lengthDisplay.textContent = passwordLength;
    const minValue=inputSlider.min
    const maxValue=inputSlider.max

    inputSlider.style.backgroundSize=((passwordLength-minValue)*100/(maxValue-minValue))+ "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
    return getRandomInteger(0, 9);
}
function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}
function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}
function generateSymbols() {
    const num = getRandomInteger(0, symbols.length);
    return symbols.charAt(num);
}
function calStrength() {
    let hasupper = false;
    let haslower = false;
    let hasnum = false;
    let hassymbol = false;

    if (uppercaseCheck.checked) {
        hasupper = true;
    }
    if (lowercaseCheck.checked) {
        haslower = true;
    }
    if (numbersCheck.checked) {
        hasnum = true;
    }
    if (symbolsCheck.checked) {
        hassymbol = true;
    }

    if (hasupper & haslower & (hassymbol | hasnum) & passwordLength >= 8) {
        setIndicator("#0f0")
    }
    else if ((hasupper | haslower) & (hasnum | hassymbol) & passwordLength <= 6) {
        setIndicator("#ff0")
    }
    else {
        setIndicator("#f00")
    }
}
async function copyContent() {
    const textToCopy = passwordDisplay.value;
    try {
        await navigator.clipboard.writeText(textToCopy)
        copyMsg.textContent = 'Copied';
    }
    catch (e) {
        copyMsg.textContent = "Failed To Copy";
    }

    copyMsg.classList.add('active')
    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000)
}

copyBtn.addEventListener('click', (() => {
    if (passwordDisplay.value) {
        copyContent();
    }
}))

function handleCheckbox() {
    checkCount = 0;
    allCheckBox.forEach(e => {
        if (e.checked) {
            checkCount++;
        }
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        inputSlider.value=passwordLength
        handleSlider();
    }
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckbox);
})



generateBtn.addEventListener('click', () => {
    if (checkCount == 0) {
        return;
    }
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        inputSlider.value=passwordLength
        handleSlider();
    }
    password = "";

    let funcArray = [];
    if (uppercaseCheck.checked) {
        funcArray.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArray.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArray.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArray.push(generateSymbols);
    }
    let len = funcArray.length;

    // the reason of attaching () after fetching function and not sending in to for loop along with () is- if we send the function with () then it fetches the values and store in array and give you the same result every time and if you attach it later
    // then it will come out and then give the random number.
    for (let i = 0; i < len; i++) {
        password += funcArray[i]();
    }

    let max = passwordLength - len;
    for (let i = 0; i < max; i++) {
        let randNum = getRandomInteger(0, len);
        password += funcArray[randNum]();
    }
    password = shufflePassword();
    passwordDisplay.value = password;
    calStrength();

})

function shufflePassword() {
    let charArray = password.split("");
    let len = charArray.length;
    let newPassword = "";

    for (let i = 0; i < len; i++) {
        newPassword += charArray[Math.floor(Math.random() * len)];
    }
    return newPassword;
}