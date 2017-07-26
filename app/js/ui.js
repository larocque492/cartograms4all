//Get csv from user upload
document.getElementById('upload_link').onclick = function() {
    document.getElementById('input_csv').click();
    userUploadFlag = true;
};

//Modal settings, as referenced in Materialize CSS
$(document).ready(function() {
    // the "href" attribute of the modal trigger must specify the modal ID that wantsupload_link_topo to be triggered
    $('.modal').modal();

    $('.modal').modal({
        // Modal can be dismissed by clicking outside of the modal
        dismissible: true,
        // Opacity of modal background
        opacity: .5,
        // Transition in duration
        inDuration: 300,
        // Transition out duration
        outDuration: 200,
        // Starting top style attribute
        startingTop: '4%',
        // Ending top style attribute
        endingTop: '10%',
        // Callback for Modal open. Modal and trigger parameters available.
        ready: function(modal, trigger) {
        },
        // Callback for Modal close
        complete: function() {
        }
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

// Opens a the system's email app so you can post images or your session ID for sharing
function shareEmail() {
        window.open('mailto:abc@abc.com?subject=Check out my cartogram!&body=Load my session at https://cartogram4all.herokuapp.com/app/index.html. My Session ID is ' + readCookie('userSessionCookie'));
}

// Opens a twitter link where you can post images or your session ID for sharing
function shareTwitter() {
    window.open(href = "https://twitter.com/intent/tweet?text=Check out my cartogram! Load my session at https://cartogram4all.herokuapp.com/app/index.html. My Session ID is " + readCookie('userSessionCookie'), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
}
