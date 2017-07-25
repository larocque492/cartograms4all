// Pre: n/a
// Post: saveFlag == false
// sets flags when writing the user's current CSV to the server && <userSessionID>.csv exists on the server
function saveSession() {
    saveFlag = true;
    init();
    saveFlag = false;
}

// Pre: <userSessionID>.csv exists on the server (you have saved a file at some point)
// Post: serverDownloadFlag == true, userUploadFlag == false && && userData = nameOfLoadFile
// sets flags and file name when loading current user's CSV from server
function loadMySession() {
    serverDownloadFlag = true;
    userUploadFlag = false;
    nameOfLoadFile = "upload/" + userSessionID + ".csv";
    init();
    serverDownloadFlag = false;
}

// Pre: user-input session id == 16 chars and is valid (i.e. has an associated .csv file on our server)
// Post: serverDownloadFlag = true && serUploadFlag == false && userData = nameOfLoadFile
// sets flags and file name when loading other user's CSV from server
function loadOtherSession() {
    if (nameOfLoadFile.length != 27) {
        alert("Error: invalid session ID. Please enter a valid session ID.");
    } else {
        serverDownloadFlag = true;
        userUploadFlag = false;
        init();
        serverDownloadFlag = false;
    }
}

// Pre: userSessionID == readCookie('userSessionCookie')
// Post: sharing form contains userSessionID in readonly form
// loads the session ID into sharing form
function shareSessionID(element) {
    if (userSessionID != null) element.value = userSessionID;
}

// Pre: user-input session id has 16 char length and is valid (i.e. has an associated .csv file on our server)
// Post: userData = nameOfLoadFile
// gets a session ID from user and uses it to load the corresponding user's CSV
document.getElementById('paste_session_id').onkeydown = function(event) {
    var e = event || windows.event;
    if (e.keyCode == 13) {
        nameOfLoadFile = "upload/" + document.getElementById('paste_session_id').value + ".csv"; // gets the session_id from the form for accessing other user's CSV's
        loadOtherSession(); // set flags and file name
    }
}

// Pre: none
// Post: return 16 char alphanumeric string
// returns a random 16 character alphanumeric string to be used as a session ID
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
function writeToServer(session_id, string_to_save) {
    var data = new FormData();
    data.append("data", string_to_save);
    data.append("name", session_id);
    var XHR = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
    XHR.open('post', 'php/importSettings.php', true);
    XHR.send(data);
}

// Pre: <session_id>.json exists on server
// Post: returns a string representation of the contents of <session_id>.json
// returns contents from app/php/settings/<session_id>.json as a string
function readFromServer(session_id) {
    var return_string;
    var data = new FormData();
    data.append("name", session_id);
    var XHR = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
    //XHR.responseType = 'text';
    XHR.onload = function() {
        if (XHR.readyState === XHR.DONE) {
            return_string = XHR.responseText;
        }
    }
    XHR.open('post', 'php/exportSettings.php', false);
    XHR.send(data);
    return return_string;
}

// Pre: readFromServer(sessionID) returns a valid .json string
// Post: current user now uses settings loaded from server
// Import cookie information through an API that reads the content of sessionId.json
// After importing, it will try to pull out the critical information like file/settings
// It then sets it for the user
function importUserSettings(sessionId) {
    //call API
    var jsonString = readFromServer(sessionId); // jsonString is read in from the correct file in php/settings folder
    //Set value of userObj (global)
    userObj = JSON.parse(jsonString);
    userData = userObj['fileName'];
    init(); //refresh the view
}

// Pre: userCookieJson is initialized
// Post: <session_id>.json stores user settings on the server
// Export cookie information and call API to write file as sessionId.json
function exportUserSettings() {
    createCookie("fileName", userData, 30, "/");
    var userCookieJson = exportCookie(); // a string representation of the JSON
    var session_id = readCookie('userSessionCookie'); // session_id is read from the cookie

    //CALL API to write the cookie information into settings/<session_id>.json
    writeToServer(session_id, userCookieJson);
}

// Pre: userCSV is a DOM object containing a valid userCSV
// Post: <userSessionID>.csv is stored on the server
// Save a .csv to the uploader/upload on the server via an ajax call.
function saveByFile(userCSV) {
    var data = new FormData();
    data.append("input_csv", userCSV);
    data.append("name", userCSV.name)
    data.append("session_id", userSessionID);

    $.ajax({
        url: 'uploader/UploadManager.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false, // Don't process the files
        contentType: false, // jQuery will tell the server its a query string request
        success: function(data, textStatus, jqXHR) {
            if (typeof data.error === 'undefined') {
                // TODO: Process the form
                //submitForm(event, data);
            } else {
                // TODO: Handle errors here
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {}
    });
}

// Pre: userSessionID is valid && nameOfLoadFile is a valid path to a .csv on the server
// Post: a new <userSessionID>.csv is stored on the server
// Save CSV to uploader/upload path given the name of the file via an ajax call
// The saved CSV can be use for other user as it is public
function saveByName() {
    var data = new FormData();
    data.append("userID", userSessionID);
    data.append("otherFileName", nameOfLoadFile);
    var XHR = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
    XHR.open('post', 'uploader/saveByName.php', true);
    XHR.send(data);
}