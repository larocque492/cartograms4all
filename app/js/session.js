var keyCodeEnter = 13;

/*
 * Updates state of application to push
 * user data to server
 */
function saveSession() {
    saveFlag = true;
    init();
    saveFlag = false;
}

/*
 * Updates state of application to
 * load session info from server
 */
function loadMySession() {
    if (haveSavedFlag) {
        serverDownloadFlag = true;
        userUploadFlag = false;
        nameOfLoadFile = UPLOAD_DIRECTORY + userSessionID + ".csv";
        init();
    } else {
        alert("Error: Please input session");
    }
}

/*
 * Loads a complete session from the server
 */
function loadOtherSession() {
    if (nameOfLoadFile.length != 27) {
        alert("Error: invalid session ID. Please enter a valid session ID.");
    } else if (nameOfLoadFile.substring(7, 23) == userSessionID && !haveSavedFlag) {
        alert("Error: you entered your own session ID but have no info saved. Please save your session info.");
    } else {
        serverDownloadFlag = true;
        userUploadFlag = false;
        init();
    }
}

/*
 * Update session id location with current session id
 */
function shareSessionID(element) {
    if (userSessionID != null) {
        element.value = userSessionID;
    }
}

/*
 * Grabs user inputted session ID
 */
document.getElementById('paste_session_id').onkeydown = function(event) {
    var e = event || windows.event;
    if (e.keyCode == keyCodeEnter) {
        nameOfLoadFile = UPLOAD_DIRECTORY + document.getElementById('paste_session_id').value + ".csv";
        loadOtherSession();
    }
}

/*
 * Creates a new session ID
 */
function generateSessionID(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';

    for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

/*
 * Writes user's application state to the server
 * (i.e. CSV file being used, custom parameters, etc)
 */
function writeToServer(session, saveData) {
    var XHR;

    var data = new FormData();
    data.append("data", saveData);
    data.append("name", session);

    if (window.XMLHttpRequest) {
        XHR = new XMLHttpRequest();
    } else {
        XHR = new activeXObject("Microsoft.XMLHTTP");
    }

    XHR.open('post', PHP_DIRECTORY + 'importSettings.php', true);
    XHR.send(data);
}

/*
 * Get session info from server
 */
function readFromServer(session) {
    var XHR;
    var returnString;

    var data = new FormData();
    data.append("name", session);

    if (window.XMLHttpRequest) {
        XHR = new XMLHttpRequest();
    } else {
        XHR = new activeXObject("Microsoft.XMLHTTP");
    }
    XHR.onload = function() {
        if (XHR.readyState === XHR.DONE) {
            returnString = XHR.responseText;
        }
    }
    XHR.open('post', PHP_DIRECTORY + 'exportSettings.php', false);
    XHR.send(data);
    return returnString;
}

/*
 * Apply session settings from the server so that application
 * state has those settings being used
 */
function importUserSettings(session) {
    var jsonString = readFromServer(session);
    userObj = JSON.parse(jsonString);
    userData = userObj['fileName'];
    init();
}

/*
 * Export application state into session settings
 */
function exportUserSettings() {
    createCookie("fileName", userData, 30, "/");
    var userCookieJson = exportCookie();
    var session = readCookie('userSessionCookie');

    writeToServer(session, userCookieJson);
}

/*
 * Upload CSV to server
 */
function saveByFile(userCSV) {
    var data = new FormData();
    data.append("input_csv", userCSV);
    data.append("name", userCSV.name)
    data.append("session_id", userSessionID);

    $.ajax({
        url: UPLOAD_DIRECTORY + 'uploadManager.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false, // jQuery will tell the server its a query string request
        success: function(data, textStatus, jqXHR) {},
        error: function(jqXHR, textStatus, errorThrown) {}
    });
    haveSavedFlag = true;
}

/*
 * Save CSV by session ID
 */
function saveByName() {
    var XHR;
    var data = new FormData();
    data.append("userID", userSessionID);
    data.append("otherFileName", nameOfLoadFile);

    if (window.XMLHttpRequest) {
        XHR = new XMLHttpRequest();
    } else {
        XHR = new activeXObject("Microsoft.XMLHTTP");
    }

    XHR.open('post', PHP_DIRECTORY + 'saveByName.php', true);
    XHR.send(data);
    haveSavedFlag = true;
}
