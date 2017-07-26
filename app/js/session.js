// Pre: n/a
// Post: saveFlag == false
// sets flags when writing the user's current CSV to the server && <userSessionID>.csv exists on the server
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

// Pre: <userSessionID>.csv exists on the server (you have saved a file at some point)
// Post: serverDownloadFlag == true, userUploadFlag == false && && userData = nameOfLoadFile
// sets flags and file name when loading current user's CSV from server
function loadMySession() {
   loadingFlag = true;
    serverDownloadFlag = true;
    userUploadFlag = false;
    nameOfLoadFile = USER_DIRECTORY + userSessionID + ".csv";
    init();
}

// Pre: user-input session id == 16 chars and is valid (i.e. has an associated .csv file on our server)
// Post: serverDownloadFlag = true && serUploadFlag == false && userData = nameOfLoadFile
// sets flags and file name when loading other user's CSV from server
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
   loadingFlag = true;
    serverDownloadFlag = true;
    userUploadFlag = false;
    init();
}

// Pre: userSessionID == readCookie('userSessionCookie')
// Post: sharing form contains userSessionID in readonly form
// loads the session ID into sharing form
/*
 * Update session id location with current session id
 */
function shareSessionID(element) {
    if (userSessionID != null) {
        element.value = userSessionID;
    }
}

// Pre: user-input session id has 16 char length and is valid (i.e. has an associated .csv file on our server)
// Post: userData = nameOfLoadFile
// gets a session ID from user and uses it to load the corresponding user's CSV
document.getElementById('paste_session_id').onkeydown = function(event) {
    var e = event || windows.event;
    if (e.keyCode == 13) {
        nameOfLoadFile = USER_DIRECTORY + document.getElementById('paste_session_id').value + ".csv"; // gets the session_id from the form for accessing other user's CSV's
        loadOtherSession(); // set flags and file name
    }
}

// Pre: none
// Post: return 16 char alphanumeric string
// returns a random 16 character alphanumeric string to be used as a session ID
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

// Pre: session_id is valid && string_to_save != null
// Post: string_to_save is stored as the contents of <session_id>.json on the server
// writes string_to_save to app/php/settings/<session_id>.json
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

// Pre: <session_id>.json exists on server
// Post: returns a string representation of the contents of <session_id>.json
// returns contents from app/php/settings/<session_id>.json as a string
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

// Pre: readFromServer(sessionID) returns a valid .json string
// Post: current user now uses settings loaded from server
// Import cookie information through an API that reads the content of sessionId.json
// After importing, it will try to pull out the critical information like file/settings
// It then sets it for the user
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

// Pre: userCookieJson is initialized
// Post: <session_id>.json stores user settings on the server
// Export cookie information and call API to write file as sessionId.json
/*
 * Export application state into session settings
 */
function exportUserSettings() {
    createCookie("fileName", userData, 30, "/");
    var userCookieJson = exportCookie();
    var session = readCookie('userSessionCookie');

    writeToServer(session, userCookieJson);
}

// Pre: userCSV is a DOM object containing a valid userCSV
// Post: <userSessionID>.csv is stored on the server
// Save a .csv to the uploader/upload on the server via an ajax call.
/*
 * Upload CSV to server
 */
function saveByFile(userCSV) {
    var data = new FormData();
    data.append("input_csv", userCSV);
    data.append("name", userCSV.name);
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
}

// Pre: userSessionID is valid && nameOfLoadFile is a valid path to a .csv on the server
// Post: a new <userSessionID>.csv is stored on the server
// Save CSV to uploader/upload path given the name of the file via an ajax call
// The saved CSV can be use for other user as it is public
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
}
