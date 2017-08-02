var timeoutDelayMs = 1000 * 60 * 0.5; // 25 mins
var checkIntervalMs = 1000 * 5;
var timerID = null;
var activityExpiryTimeStamp = null;
function activityDetected() {
    activityExpiryTimeStamp = Date.now() + timeoutDelayMs;
    checkActivityStatus();
    displayLog('Activity detected');
}
function checkActivityStatus() {
    displayLog('Checking activity status');
    clearTimeout(timerID);
    if (!activityExpiryTimeStamp)
        return;
    if (Date.now() >= activityExpiryTimeStamp) {
        inactivityDetected();
    }
    else {
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
function switchBackToTab() {
    displayLog('User switched back to this tab');
    checkActivityStatus();
}
//________________________________________________________________________________________________________________
var logDomElement = document.getElementById('log');
function displayLog(msg) {
    var now = new Date();
    var logMessage = timeFormat(now) + ' | ' + timeFormat(activityExpiryTimeStamp) + ' | ' + msg;
    var listItem = document.createElement('li');
    var textNode = document.createTextNode(logMessage);
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
activityDetected(); // initialise
document.body.addEventListener("click", activityDetected);
window.onfocus = switchBackToTab;
window.onpageshow = switchBackToTab;
document.addEventListener('visibilitychange', switchBackToTab);
