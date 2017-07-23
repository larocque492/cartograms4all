//------------index.js----------------------//

// Flags
var userUploadFlag = false; // true if using user-uploaded CSV
var serverDownloadFlag = false; //true if using CSV from server
var saveFlag = false; // true if saving your current session
var haveSavedFlag = false; // true if you have saved a csv on the server

// Global variables
var csvFields;
var map;
var zoom;
var layer;
var percent;
var fieldSelect;
var fieldsById;
var stat;
var body;
var topology;
var carto;
var geometries;
var userSessionCookie; // name of current user's cookie that stores session ID
var userSessionID; // user's session ID as read from cookie
var nameOfLoadFile; // name of remote CSV being used (usually another user's session ID)
var userData; // path to remote CSV being used
var CSV; // locally stored csv file object

// DATASHEET CONFIG
var DEFAULT_DATA = "data/nst_2011.csv";
var DEFAULT_TOPO = "data/us-states.topojson";
var USER_DIRECTORY = "uploader/upload/";
var USER_CSV; // holds object containing .csv file
var USER_TOPO;
var CSV_URL; // DOMString containing URL representing USER_CSV

var fields;
var states;


/*
 * Main program instructions
 */
console.log("Running Cartograms 4 All Web App");

$(document).ready(function() {
  nameOfLoadFile = "data/nst_2011.csv";
  // if not already set, set new cookie.
  var session_id = generateSessionID(16);
  if(readCookie('userSessionCookie') === null) {
    createCookie('userSessionCookie', session_id, 10, '/');
  }
  userSessionID = readCookie('userSessionCookie');
  shareSessionID(document.getElementById("disabled"));
  init();
});
/*
 * End of main program instructions
 */

/*
I'm noticing that Chrome is complaining a lot about undefined functions in index.js. This leads me to believe that
we don't have any way of including scripts within each other - unless I'm an idiot and something is being used that
I don't see, we need to set jQuery or ajax or something to load scripts within other script files, if we want the files
to exist separately. Since Tim's index.html just had the main logic that depends upon the script files, we need to either
include functions.js and cartogram.js in index.js, or they won't work together (I think!)
Or we could just put the main logic back in index.html, even though that's not as pretty or satisfying. -JSL

*/

//initialization of the entire map

function init() {

  CSV = document.getElementById('input_csv').files[0];

  if(userSessionID == null) {
    userSessionID = readCookie('userSessionCookie');
  }

  // if using CSV uploaded by user
  if(userUploadFlag && !serverDownloadFlag) {
    userData = URL.createObjectURL(CSV);
    console.log("1: "+userData);
  }
  // if using CSV downloaded from server
  if(!userUploadFlag && serverDownloadFlag) {
    userData = "uploader/" + nameOfLoadFile;
    console.log("2: "+userData);
  }
  // if using neither, set to defaults
  if(!userUploadFlag && !serverDownloadFlag){
    userData = DEFAULT_DATA;

    console.log("3: "+userData);
  }

  // if you are saving on this init, save currently loaded CSV to the server
  if(saveFlag) {
    if(userUploadFlag && !serverDownloadFlag){
      saveByFile(CSV); // if using CSV uploaded by user
    } else {
      saveByName(nameOfLoadFile); // if using file stored on server
    }
  }

  console.log("Cartograms 4 All: Start init()");
  map = d3.select("#map");
  zoom = d3.behavior.zoom()
    .translate([-38, 32])
    .scale(.94)
    .scaleExtent([0.5, 10.0])
    .on("zoom", updateZoom);
  layer = map.append("g")
    .attr("id", "layer")
    .call(zoom),
    states = layer.append("g")
    .attr("id", "states")
    .selectAll("path")
    .call(zoom);

  csvFields = getCSVFields(initCartogram, userData);

  var proj = d3.geo.albersUsa(),
    rawData,
    dataById = {};

  carto = d3.cartogram()
    .projection(proj)
    .properties(function(d) {
      return dataById[d.id];
    })
    .value(function(d) {
      return +d.properties[field];
    });

  
  d3.json(DEFAULT_TOPO, function(topology) {
    this.topology = topology;
    geometries = topology.objects.states.geometries;
    d3.csv(userData, function(rawData) {
      dataById = d3.nest()
        .key(function(d) {
          return d.NAME;
        })
        .rollup(function(d) {
          return d[0];
        })
        .map(rawData);
      var features = carto.features(topology, geometries),
        path = d3.geo.path().projection(proj);

      states = states.data(features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("id", function(d) {
          return d.properties.NAME;
        })
        .attr("fill", "#fff")
        .attr("d", path);
      states.append("title");

      // Waits until fields has been defined
      function waitForFields() {
        if (typeof someVariable !== "undefined") {
          parseHash(fieldsById);
        } else {
          setTimeout(waitForFields, 250);
        }
      }

      // Waits until fields has been defined
      function waitForTopology() {
        if (typeof someVariable !== "undefined") {
          initTopo();
        } else {
          setTimeout(topology, 250);
        }
      }
    });
  });

  console.log("Cartograms 4 All: Finished init()");
}

//initialization of the new cartogram,
//based on the csv fields passed in.
function initCartogram(csvFields) {
  fields = csvFields;
  // Data info for the cartogram
  percent = (function() {
      var fmt = d3.format(".2f");
      return function(n) {
        return fmt(n) + "%";
      };
    })(),
    fields = csvFields,
    // TODO: Make this customizable
    // NOTE: Might just have this detect if there are digits at the end of the column or beginning,
    // and if there are then use those as a year
    // TODO: Make a custom function getTimeInField() which will clear
    fieldsById = d3.nest()
    .key(function(d) {
      return d.id;
    })
    .rollup(function(d) {
      return d[0];
    })
    .map(fields),
    // TODO: Set default field to something that looks like data
    field = fields[0],
    // TODO: Allow for customization of map color
    colors = colorbrewer.RdYlBu[3]
    .reverse()
    .map(function(rgb) {
      return d3.hsl(rgb);
    });

  body = d3.select("body");
  stat = d3.select("#status");

  fieldSelect = d3.select("#field")
    .on("change", function(e) {
      field = fields[this.selectedIndex];
      location.hash = "#" + field.id;
    });

  fieldSelect.selectAll("option")
    .data(fields)
    .enter()
    .append("option")
    .attr("value", function(d) {
      return d.id;
    })
    .text(function(d) {
      return d.name;
    });

  /* TODO: Reincorporate year
  var yearSelect = d3.select("#year")
      .on("change", function(e) {
          year = years[this.selectedIndex];
          location.hash = "#" + [field.id, year].join("/");
      });


  yearSelect.selectAll("option")
      .data(years)
      .enter()
      .append("option")
      .attr("value", function(y) { return y; })
      .text(function(y) { return y; })
  */

  updateZoom();
}

window.onhashchange = function() {
  parseHash(fieldsById);
};

var deferredUpdate = (function() {
  var timeout;
  return function() {
    var args = arguments;
    clearTimeout(timeout);
    stat.text("calculating...");
    return timeout = setTimeout(function() {
      update.apply(null, arguments);
    }, 10);
  };
})();

var hashish = d3.selectAll("a.hashish")
  .datum(function() {
    return this.href;
  });
