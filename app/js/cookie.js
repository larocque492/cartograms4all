//------------cookie.js----------------------//

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
