//Get csv from user upload
document.getElementById('upload_link').onclick = function() {
    document.getElementById('input_csv').click();
    userUploadFlag = true;
};

//Modal settings, as defined by Material Design Guidelines
$(document).ready(function() {
    // the "href" attribute of the modal trigger must specify the modal ID that wantsupload_link_topo to be triggered
    $('.modal').modal();

    $('.modal').modal({
        dismissible: true,  // Modal can be dismissed by clicking outside of the modal
        opacity: .5,        // Opacity of modal background
        inDuration: 300,    // Transition in duration
        outDuration: 200,   // Transition out duration
        startingTop: '4%',  // Starting top style attribute
        endingTop: '10%',   // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            //alert("Ready test 1 2");
        },
        complete: function() {
            //alert('Closed test test');
        } // Callback for Modal close
    });

    $(".dropdown-button").dropdown();
});

//Converts svg to png and downloads it as 'cartogram.png'
function download_png() {
    var svg = d3.select('svg');
    saveSvgAsPng(d3.select('svg').node(), 'cartogram.png');
}

//Collects svg info and downloads it as 'svg_info.svg'
$('#download_svg').click(function() {
    var a = document.createElement('a');
    a.href = 'data:image/svg+xml;utf8,' + unescape($('#map')[0].outerHTML);
    a.download = 'svg_info.svg';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// Opens a the system's email app so you can post images or your session ID for sharing
function share_email() {
        window.open('mailto:abc@abc.com?subject=Check out my cartogram!&body=Load my session at https://cartogram4all.herokuapp.com/app/index.html. My Session ID is ' + userSessionCookie);
}

// Opens a twitter link where you can post images or your session ID for sharing
function share_twitter() {
    window.open(href = "https://twitter.com/intent/tweet?text=Check out my cartogram! Load my session at https://cartogram4all.herokuapp.com/app/index.html. My Session ID is " + userSessionCookie, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
}
