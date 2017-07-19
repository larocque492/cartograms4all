//------------Input Button Stuff----------------------//
// Reference: http://jsfiddle.net/gregorypratt/dhyzV/ //
document.getElementById('upload_link').onclick = function() {
  document.getElementById('input_csv').click();
};

document.getElementById('upload_link_topo').onclick = function() {
  document.getElementById('input_topo').click();
};
/*
 * Code to run when document is ready
 */
$(document).ready(function() {
  // the "href" attribute of the modal trigger must specify the modal ID that wantsupload_link_topo to be triggered
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


//------------Customize Button Stuff----------------//
var modal = document.getElementById('modal');
var btn = document.getElementById("cust_file");
var exit = document.getElementsByClassName("close")[0];


// modal appears when Customize Btn is clicked
btn.onclick = function() {
  modal.style.display = "block";
}

exit.onclick = function() {
    console.log("cust close");
    modal.style.display = "none";
}


// run is called when the submit button is clicked
// it saves whatever is in each textarea to a variable
// TODO: parse the input to work with cartogram
function run() {
  //var cust_file_name = document.getElementById("file_name").value;
  var col_1_input = document.getElementById("data_col_1").value;
  var col_2_input = document.getElementById("data_col_2").value;
  //var col_3_input =  document.getElementById("data_col_3").value;
  //console.log(cust_file_name);
  console.log(col_1_input);
  console.log(col_2_input);
  //console.log(col_3_input);

}

//------------------Share Cartogram Button-----------//
var share_modal = document.getElementById('share_modal');
var share_btn = document.getElementById("share_cartogram");
var share_exit = document.getElementsByClassName("share_close")[0];

share_btn.onclick = function() {
  share_modal.style.display = "block";
}

share_exit.onclick = function() {
    console.log("close share");
    share_modal.style.display = "none";
}


//------------------Publish Cartogram Button-----------//
var publish_modal = document.getElementById('publish_modal');
var publish_btn = document.getElementById("download_cartogram");
var publish_exit = document.getElementsByClassName("publish_close")[0];

publish_btn.onclick = function() {
  publish_modal.style.display = "block";
}

publish_exit.onclick = function() {
    console.log("close publish");
    publish_modal.style.display = "none";
}


function download_png(){
   console.log("download png");   
   var svg = d3.select('svg');
   saveSvgAsPng(d3.select('svg').node(), 'cartogram.png');
}



$('#download_svg').click(function(){
        var a      = document.createElement('a');
		a.href     = 'data:image/svg+xml;utf8,' + unescape($('#map')[0].outerHTML);
		a.download = 'cartogram.svg';
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


  
      