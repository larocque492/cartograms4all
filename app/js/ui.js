/* ----Important for maping----
So the user is now able to enter his own topojson and csv in addition to the latitude, longitude and the scale 
so his he can view any map he would like. An important condition is the entry under NAME in the csv must equal to 
the id field in the topojson. Also to make it easy, if someone want to map the US map, he can enter 1 in all the field in 
the website and it will work. make sure you remove all spaces in the fields when entering values because 
they might cause trouble.

you can try syria map with these coordinate

38.996815
34.802075
4500 for projection
and 1 for the colors or any number for now.
syria files are in data folder:
syria.csv
SyriaGovernorates.json
*/


//------------Input Button Stuff----------------------//

document.getElementById('upload_link').onclick = function() {
  document.getElementById('input_csv').click();

};

document.getElementById('upload_link_topo').onclick = function() {
  document.getElementById('input_topo').click();
};

function clearContents(element) {
  switch(element.value) {
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


<<<<<<< HEAD
=======
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

// There are no built in methods in d3 for downloading svgs, but there are
// several public methods that work
//https://bitbucket.org/mas29/public_resources/raw/b9bafa002053b4609bd5186010d19e959cba33d4/scripts/js/svg_download/downloadSVG.js
function download_svg() {
   var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

   window.URL = (window.URL || window.webkitURL);

   var body = document.body;

   var prefix = {
     xmlns: "http://www.w3.org/2000/xmlns/",
     xlink: "http://www.w3.org/1999/xlink",
     svg: "http://www.w3.org/2000/svg"
  }

  initialize();

  function initialize() {
    var documents = [window.document],
        SVGSources = [];
        iframes = document.querySelectorAll("iframe"),
        objects = document.querySelectorAll("object");

    [].forEach.call(iframes, function(el) {
      try {
        if (el.contentDocument) {
          documents.push(el.contentDocument);
        }
      } catch(err) {
        console.log(err)
      }
    });

    [].forEach.call(objects, function(el) {
      try {
        if (el.contentDocument) {
          documents.push(el.contentDocument);
        }
      } catch(err) {
        console.log(err)
      }
    });

    documents.forEach(function(doc) {
      var styles = getStyles(doc);
      var newSources = getSources(doc, styles);
      // because of prototype on NYT pages
      for (var i = 0; i < newSources.length; i++) {
        SVGSources.push(newSources[i]);
      };
    })
    if (SVGSources.length > 1) {
       createPopover(SVGSources);
    } else if (SVGSources.length > 0) {
       download(SVGSources[0]);
    } else {
       alert("The Crowbar couldnâ€™t find any SVG nodes.");
    }
  }

  function createPopover(sources) {
    cleanup();

    sources.forEach(function(s1) {
      sources.forEach(function(s2) {
        if (s1 !== s2) {
          if ((Math.abs(s1.top - s2.top) < 38) && (Math.abs(s1.left - s2.left) < 38)) {
            s2.top += 38;
            s2.left += 38;
          }
        }
      })
    });

    var buttonsContainer = document.createElement("div");
    body.appendChild(buttonsContainer);

    buttonsContainer.setAttribute("class", "svg-crowbar");
    buttonsContainer.style["z-index"] = 1e7;
    buttonsContainer.style["position"] = "absolute";
    buttonsContainer.style["top"] = 0;
    buttonsContainer.style["left"] = 0;


>>>>>>> 4461ae6c6ad8eca29ff4dd5775288bc7124fea58


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

<<<<<<< HEAD
function saveSession(){
  console.log("saveSession()");
}

function loadSession(){
  console.log("loadSession()");
}
  
      
=======
>>>>>>> 4461ae6c6ad8eca29ff4dd5775288bc7124fea58
