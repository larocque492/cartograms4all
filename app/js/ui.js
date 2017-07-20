//------------Input Button Stuff----------------------//

document.getElementById('upload_link').onclick = function() {
  document.getElementById('input_csv').click();
};

document.getElementById('upload_link_topo').onclick = function() {
  document.getElementById('input_topo').click();
};

function clearContents(element) {
  switch(element) {
    case "Enter projection":
        element.value = '';
        break;
    case "Enter scale":
        element.value = '';
        break;
    case "Enter set of colors":
        element.value = '';
        break;
    case "Enter session ID":
        element.value = '';
        break;
  }
}

/*
 * Code to run when document is ready
 */
$(document).ready(function() {
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();

  $('.modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      //alert("Ready test 1 2");
      console.log(modal, trigger);
    },
    complete: function() {
      //alert('Closed test test');
    } // Callback for Modal close
  });

  $(".dropdown-button").dropdown();
});




function download_png(){
   console.log("download png");   
   var svg = d3.select('svg');
   saveSvgAsPng(d3.select('svg').node(), 'cartogram.png');
}



$('#download_svg').click(function(){
        var a      = document.createElement('a');
		a.href     = 'data:image/svg+xml;utf8,' + unescape($('#map')[0].outerHTML);
		a.download = 'svg_info.svg';
		a.target   = '_blank';
		document.body.appendChild(a); a.click(); document.body.removeChild(a);
	});


function share_email(){
    console.log("email");
    svgAsDataUri(d3.select('svg').node(), {}, function(uri) {
    //   console.log('uri', uri);     
    //   var pic = d3.select('svg');
        var pic = d3.select('svg');
       window.open('mailto:abc@abc.com?subject=Check out my cartogram!&body='+pic);
      // window.location.href = "mailto:mail@example.org?subject=Mail request&body="+body;
    });
}

function share_twitter(){
    console.log("tweet");
    window.open(href="https://twitter.com/intent/tweet?text=Hello%20world", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
}


  
      