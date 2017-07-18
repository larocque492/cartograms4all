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
// Reference: http://jsfiddle.net/gregorypratt/dhyzV/ //
document.getElementById('upload_link').onclick = function() {
  document.getElementById('input_csv').click();

};

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
      alert("Ready");
      console.log(modal, trigger);
    },
    complete: function() {
      alert('Closed');
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



    var background = document.createElement("div");
    body.appendChild(background);

    background.setAttribute("class", "svg-crowbar");
    background.style["background"] = "rgba(255, 255, 255, 0.7)";
    background.style["position"] = "fixed";
    background.style["left"] = 0;
    background.style["top"] = 0;
    background.style["width"] = "100%";
    background.style["height"] = "100%";

    sources.forEach(function(d, i) {
      var buttonWrapper = document.createElement("div");
      buttonsContainer.appendChild(buttonWrapper);
      buttonWrapper.setAttribute("class", "svg-crowbar");
      buttonWrapper.style["position"] = "absolute";
      buttonWrapper.style["top"] = (d.top + document.body.scrollTop) + "px";
      buttonWrapper.style["left"] = (document.body.scrollLeft + d.left) + "px";
      buttonWrapper.style["padding"] = "4px";
      buttonWrapper.style["border-radius"] = "3px";
      buttonWrapper.style["color"] = "white";
      buttonWrapper.style["text-align"] = "center";
      buttonWrapper.style["font-family"] = "'Helvetica Neue'";
      buttonWrapper.style["background"] = "rgba(0, 0, 0, 0.8)";
      buttonWrapper.style["box-shadow"] = "0px 4px 18px rgba(0, 0, 0, 0.4)";
      buttonWrapper.style["cursor"] = "move";
      buttonWrapper.textContent =  "SVG #" + i + ": " + (d.id ? "#" + d.id : "") + (d.class ? "." + d.class : "");

      var button = document.createElement("button");
      buttonWrapper.appendChild(button);
      button.setAttribute("data-source-id", i)
      button.style["width"] = "150px";
      button.style["font-size"] = "12px";
      button.style["line-height"] = "1.4em";
      button.style["margin"] = "5px 0 0 0";
      button.textContent = "Download";

      button.onclick = function(el) {
        // console.log(el, d, i, sources)
        download(d);
      };

    });

  }

  function cleanup() {
    var crowbarElements = document.querySelectorAll(".svg-crowbar");

    [].forEach.call(crowbarElements, function(el) {
      el.parentNode.removeChild(el);
    });
  }


  function getSources(doc, styles) {
    var svgInfo = [],
        svgs = doc.querySelectorAll("svg");

    styles = (styles === undefined) ? "" : styles;

    [].forEach.call(svgs, function (svg) {

      svg.setAttribute("version", "1.1");

      var defsEl = document.createElement("defs");
      svg.insertBefore(defsEl, svg.firstChild); //TODO   .insert("defs", ":first-child")
      // defsEl.setAttribute("class", "svg-crowbar");

      var styleEl = document.createElement("style")
      defsEl.appendChild(styleEl);
      styleEl.setAttribute("type", "text/css");


      // removing attributes so they aren't doubled up
      svg.removeAttribute("xmlns");
      svg.removeAttribute("xlink");

      // These are needed for the svg
      if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
        svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
      }

      if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
        svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
      }

      var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');
      var rect = svg.getBoundingClientRect();
      svgInfo.push({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        class: svg.getAttribute("class"),
        id: svg.getAttribute("id"),
        childElementCount: svg.childElementCount,
        source: [doctype + source]
      });
    });
    return svgInfo;
  }

  function download(source) {
    var filename = "untitled";

    if (source.id) {
      filename = source.id;
    } else if (source.class) {
      filename = source.class;
    } else if (window.document.title) {
      filename = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }

    var url = window.URL.createObjectURL(new Blob(source.source, { "type" : "text\/xml" }));

    var a = document.createElement("a");
    body.appendChild(a);
    a.setAttribute("class", "svg-crowbar");
    a.setAttribute("download", filename + ".svg");
    a.setAttribute("href", url);
    a.style["display"] = "none";
    a.click();

    setTimeout(function() {
      window.URL.revokeObjectURL(url);
    }, 10);
  }

  function getStyles(doc) {
    var styles = "",
        styleSheets = doc.styleSheets;

    if (styleSheets) {
      for (var i = 0; i < styleSheets.length; i++) {
        processStyleSheet(styleSheets[i]);
      }
    }

    function processStyleSheet(ss) {
      if (ss.cssRules) {
        for (var i = 0; i < ss.cssRules.length; i++) {
          var rule = ss.cssRules[i];
          if (rule.type === 3) {
            // Import Rule
            processStyleSheet(rule.styleSheet);
          } else {
            // hack for illustrator crashing on descendent selectors
            if (rule.selectorText) {
              if (rule.selectorText.indexOf(">") === -1) {
                styles += "\n" + rule.cssText;
              }
            }
          }
        }
      }
    }
    return styles;
  }
}
      
function download_png(){
   console.log("download png");   
   var svg = d3.select('svg');
   saveSvgAsPng(d3.select('svg').node(), 'cartogram.png');
}

function share_email(){
    console.log("email");
    //window.open('mailto:test@example.com');
    window.open('mailto:abc@abc.com?subject=my subject&body=see attachment&attachment="+"/my_location_virtual_path/myfile.lis');
    
}

function share_twitter(){
    console.log("tweet");
    window.open(href="https://twitter.com/intent/tweet?text=Hello%20world", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
}

