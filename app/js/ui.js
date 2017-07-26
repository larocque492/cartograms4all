// Pre: 
// Post: 
// Brings up upload function 
/*
 * Get user uploaded CSV
 */
document.getElementById('upload_link').onclick = function() {
    document.getElementById('input_csv').click();
    userUploadFlag = true;
};

/*
 * UI init
 */
$(document).ready(function() {
    $('.modal').modal();

    $('.modal').modal({
        dismissible: true,
        opacity: .5,
        inDuration: 300,
        outDuration: 200,
        startingTop: '4%',
        endingTop: '10%',

        // Callback for Modal open. Modal and trigger parameters available.
        ready: function(modal, trigger) {},
        // Callback for Modal close
        complete: function() {}
    });

    $(".dropdown-button").dropdown();
});

function downloadCartogramPNG() {
    var svg = d3.select('svg');
    saveSvgAsPng(d3.select('svg').node(), 'cartogram.png');
}

$('#download_svg').click(function() {
    var a = document.createElement('a');
    a.href = 'data:image/svg+xml;utf8,' + unescape($('#map')[0].outerHTML);
    a.download = 'myCartogram.svg';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

$('#maps-clear').click(function() {
    $("#map g").remove();
});

function shareEmail() {
        window.open('mailto:abc@abc.com?subject=Check out my cartogram!&body=Load my session at https://cartogram4all.herokuapp.com/app/index.html. My Session ID is ' + readCookie('userSessionCookie'));
}

function shareTwitter() {
    window.open(href = "https://twitter.com/intent/tweet?text=Check out my cartogram! Load my session at https://cartogram4all.herokuapp.com/app/index.html. My Session ID is " + readCookie('userSessionCookie'), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
}
