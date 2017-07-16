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
    for(var cookie=0;i < cookies.length;i++) {
        var cookie = ca[i];
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
  })
  return JSON.stringify(cookieInString);
}

//Import cookie information through an API that reads the content of sessionId.json
//After importing, it will try to pull out the critical information like file/settings
//It then sets it for the user
function importUserSettings() {
  //call API 
  var userCookie = 'API_PLACEHOLDER';
  var userObj = JSON.parse(jsonString);
  //console.log(jsonObj);
  CSV_URL = userObj['CSV_URL'];
  
  //set settings
  //setSettings(jsonObj['userSettings']);
  init(); //refresh the view
}

//Export cookie information and call API to write file as sessionId.json
function exportUserSettings() {
  var userCookie = exportCookie();
  var sessionId = userCookie['c4a_session_id'];
  //CALL API to write the cookie information into sessionId
  //WRITE_FILE(sessionId);
}
