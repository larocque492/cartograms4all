//Functions that manipulate cookie and information pertain to individual user

//Create cookie will be use to store user setting and data file information
//It will be consumed when we export the cookie information as a JSON to server
function createCookie(name, value, daysToExpire, path) {
  var date = new Date();
  date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000)); //number of days before expire
  var expires = date.toUTCString();
  //Setting the expire date and path of the cookie on the site
  document.cookie = name + '=' + value + ';' +
                   'expires=' + expires + ';' +
                   'path=' + path + ';';
}

// return value of cookie specified by name
function readCookie(name) {
    var nameAttr = name + "=";
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0)==' ') cookie = cookie.substring(1,cookie.length);
        if (cookie.indexOf(nameAttr) == 0) return cookie.substring(nameAttr.length,cookie.length);
    }
    return null;
}

//Export cookie information as JSON
function exportCookie() {
  //parse all the cookie information
  var cookiesInString = document.cookie.split(';').map(function(cookieRecord) {
    var i = cookieRecord.indexOf('=');
    //It splits the cookieName and cookieValue and save them as a tuple
    return [cookieRecord.substring(0,i), cookieRecord.substring(i+1)];
  });
  return JSON.stringify(cookieInString);
}

//Import cookie information through an API that reads the content of sessionId.json
//After importing, it will try to pull out the critical information like file/settings
//It then sets it for the user
function importUserSettings() {
  //call API
  var session_id = readCookie('user_session_cookie');
  var jsonString = readFromServer(session_id); // jsonString is read in from the correct file in php/settings folder
  //Set value of userObj (global)
  userObj = JSON.parse(jsonString);
  CSV_URL = userObj['fileName'];
  init(); //refresh the view
}

//Export cookie information and call API to write file as sessionId.json
function exportUserSettings() {
  createCookie("fileName", USER_CSV, 30, "/");
  var userCookieJson = exportCookie(); // a string representation of the JSON
  var session_id = readCookie('user_session_cookie'); // session_id is read from the cookie

  //CALL API to write the cookie information into settings/<session_id>.json
  writeToServer(session_id, userCookieJson);
}
