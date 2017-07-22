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
var proj;
var col = 1;
var whichMap = 2;
/* Different integers will correspond to different maps, which accept different .csv data.
* The default integer, 0, tells the map to take in data for and display the USA,
* and 1 will choose Syria.
* 2 is UK, 3
* More maps on the way! Also, the drop down menu should actually set this integer soon.
* /


/*
 * Main program instructions
 */
console.log("Running Cartograms 4 All Web App");

$(document).ready(function() {
  //if not already set, set new cookie.
  var session_id = generateSessionID(16);
  if( readCookie('userSessionCookie') === null ){
    createCookie('userSessionCookie', session_id, 10, '/');
  }
  init();
});

/*
 * End of main program instructions
 */

//map initialization

function init() {
  // don't initialize until user has uploaded a .csv file

  if(document.getElementById('input_csv').files[0] == null){
    console.log("Cartograms 4 All: Waiting for user inputted CSV file");
    return;  
  }

  USER_CSV = document.getElementById('input_csv').files[0];

  var rawData,
  dataById = {},
  URL_TOPO;

  if (whichMap === 0) {
    console.log("Using USA topojson");
    proj = d3.geo.albersUsa();
    URL_TOPO = DATA_DIRECTORY + "us-states.topojson";

  } else if (whichMap === 1) {
    console.log("Using syria topojson.");
    URL_TOPO = DATA_DIRECTORY + "SyriaGovernorates.topojson";
    setProjection(39, 34.8, 4500);

  } else if (whichMap === 2) {
    console.log("Using UK topojson.");
    URL_TOPO = DATA_DIRECTORY + "uk.topojson";
    setProjection(-1.775320, 52.298781, 4500);
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

  csvFields = getCSVFields(initCartogram);

  carto = d3.cartogram()
    .projection(proj)
    .properties(function(d) {
      return dataById[d.id];
    })
    .value(function(d) {
      return +d.properties[field];
    });


  d3.json(URL_TOPO, function(topology) {
    this.topology = topology;
    geometries = topology.objects.states.geometries;
    d3.csv(CSV_URL, function(rawData) {
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

    });
  });

  console.log("Cartograms 4 All: Finished init()");
}

function setProjection(lat, long, pScale) {

    width = 1215,
        height = 600;

    var center = [lat, long];
    proj = d3.geo.conicConformal()
        .center(center)
        .clipAngle(180)
        // Size of the map itself, you may want to play around with this in
        // relation to your canvas size
        .scale(pScale)
        // Center the map in the middle of the canvas
        .translate([width / 2, height / 2])
        .precision(.1);
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
    field = fields[1],
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

  updateZoom();
}

window.onhashchange = function() {
  console.log("calling parseHash(fieldsById)")
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
