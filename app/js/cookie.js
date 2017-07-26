/*
 * General utility for creating a cookie
 */
function createCookie(name, value, daysToExpire, path) {
    var date = new Date();
    // Set how long the cookie should last
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    var expires = date.toUTCString();

    // Set cookie data in the users browser
    document.cookie = name + '=' + value + ';' +
        'expires=' + expires + ';' +
        'path=' + path + ';';
}

/*
 * General utility to get value of a cookie
 */
function readCookie(name) {
    var nameAttr = name + "=";
    var cookies = document.cookie.split(';');

    // Search through all the cookies
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameAttr) == 0)
            return cookie.substring(nameAttr.length, cookie.length);
    }

    // Cookie not found
    return null;
}

/*
 * Export cookie as JSON
 */
function exportCookie() {
    //parse all the cookie information
    var cookiesInString = document.cookie.split(';').map(function(cookieRecord) {
        var i = cookieRecord.indexOf('=');
        //It splits the cookieName and cookieValue and save them as a tuple
        return [cookieRecord.substring(0, i), cookieRecord.substring(i + 1)];
    });
    return JSON.stringify(cookieInString);
}
