//Functions that manipulate cookie and information pertain for individual user

//Create cookie will be use to store user setting and data file information
//It will get consumed when we export the cookie information as a JSON to server
function create_cookie(name, value, days2expire, path) {
  var date = new Date();
  date.setTime(date.getTime() + (days2expire * 24 * 60 * 60 * 1000));
  var expires = date.toUTCString();
  document.cookie = name + '=' + value + ';' +
                   'expires=' + expires + ';' +
                   'path=' + path + ';';
}


