const timeoutDelayMs = 1000*60*0.5;  // 25 mins
const checkIntervalMs = 1000*5;

let timerID = null;
let activityExpiryTimeStamp = null;

function activityDetected() {
    activityExpiryTimeStamp = Date.now() + timeoutDelayMs;
    checkActivityStatus();
    displayLog('Activity detected');
}

function checkActivityStatus() {
    displayLog('Checking activity status');
    clearTimeout(timerID);
    if (!activityExpiryTimeStamp) return;
    if (Date.now() >= activityExpiryTimeStamp) {
        inactivityDetected();
    } else {
        timerID = setTimeout(checkActivityStatus, checkIntervalMs);
    }
}

function inactivityDetected() {
    // No need to keep checking
    clearTimeout(timerID);
    timerID = null;
    activityExpiryTimeStamp = null;
    displayLog('Inactivity detected');
}

//________________________________________________________________________________________________________________


const logDomElement = document.getElementById('log');


function displayLog(msg) {
    const now = new Date();
    const logMessage = timeFormat(now) + ' | ' + timeFormat(activityExpiryTimeStamp) + ' | ' + msg;

    const listItem = document.createElement('li');
    const textNode = document.createTextNode(logMessage);
    listItem.appendChild(textNode);
    logDomElement.appendChild(listItem);
}


function timeFormat(date) {
    if (!date) {
        return date;
    }
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.getHours() + ':' + twoDigits(date.getMinutes()) + ':' + twoDigits(date.getSeconds());
}

function twoDigits(n) {
    return ('0' + n).slice(-2);
}


//________________________________________________________________________________________________________________

activityDetected();  // initialise
document.body.addEventListener("click", activityDetected);
window.onfocus = () => {
    displayLog('window.onfocus');
    checkActivityStatus();
}
