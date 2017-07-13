//Functions that manipulate cookie and information pertain for individual user

//Create cookie will be use to store user setting and data file information
//It will get consumed when we export the cookie information as a JSON to server
function create_cookie(name, value, days2expire, path) {
  var date = new Date();
  date.setTime(date.getTime() + (days2expire * 24 * 60 * 60 * 1000)); //number of days before expire
  var expires = date.toUTCString();
  //Setting the expire date and path of the cookie on the site
  document.cookie = name + '=' + value + ';' +
                   'expires=' + expires + ';' +
                   'path=' + path + ';';
}


//Export cookie information as JSON
function exportCookie() {
  //parse all the cookie information
  var cookiesInString = document.cookie.split(':').map(function(cookieRecord) {
    var i = cookieRecord.indexOf('=');
    //It splits the cookieName and cookieValue and save them as a tuple
    return [cookieRecord.substring(0,i), cookieRecord.substring(i+1)];
  }
  return JSON.stringify(cookieInString);
}

//Import cookie information through an API that reads the content of sessionId.json
//After importing, it will try to pull out the critical information like file/settings
//It then sets it for the user
function importUserSettings() {
  //call API 
  var jsonString = 'API_PLACEHOLDER';
  var jsonObj = JSON.parse(jsonString);
  //console.log(jsonObj);
  
  //set file
  //setfilePath(jsonOb['fileName']);

  //set settings
  //setSettings(jsonObj['userSettings']);
}


