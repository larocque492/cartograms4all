// Global variables

var csvFields;
var map;
var zoom;
var scale = .94;
var layer;
var percent;
var fieldSelect;
var fieldsById;
var stat;
var body;
var topology;
var carto;
var geometries;
var latitude;
var longitude;
var whichMap = 1;// Different integers will correspond to different maps here.
// The default integer, 0, tells the map to display the USA. 1 will display Syria. More on the way!
// Syria just needs to actually start working first.

/*
 * Main program instructions
 */
console.log("Running Cartograms 4 All Web App");

$(document).ready(function() {
  // if not already set, set new cookie.
  var session_id = generateSessionID(16);
  if( readCookie('userSessionCookie') === null ){
    createCookie('userSessionCookie', session_id, 10, '/');
  }
  init();

  map
    .call(updateZoom)
    .call(zoom.event);
});

/*
 * End of main program instructions
 */

//initialization of the entire map

function init() {
  // don't initialize until user has uploaded a .csv file
  if (document.getElementById('input_csv').files[0] == null) {
    console.log("Cartograms 4 All: Waiting for user inputted CSV file");
    return;
  }
  // CODE TO TEST FUNCTIONALITY OF writeToServer() and readFromServer()
  SESSION_ID = readCookie('userSessionCookie');

  //var send_text = "my_text_to_save";
  //writeToServer(SESSION_ID, send_text);
  //console.log(SESSION_ID);

  //var return_string = readFromServer(SESSION_ID);
  //console.log(return_string);
  // CODE TO TEST FUNCTIONALITY OF writeToServer() and readFromServer()

  USER_CSV = document.getElementById('input_csv').files[0];
  console.log("Cartograms 4 All: Start init()");
  map = d3.select("#map");
  zoom = d3.behavior.zoom()
    .translate([-38, 32])
    .scale(scale)
    .scaleExtent([0.1, 20.0])
    .on("zoom", updateZoom);
  layer = map.append("g")
    .attr("id", "layer")
    .call(zoom),
    states = layer.append("g")
    .attr("id", "states")
    .selectAll("path")
    .call(zoom);

  csvFields = getCSVFields(initCartogram);

  var proj,
    topoURL,
    rawData,
    dataById = {};


  var width = 1215,
      height = 600;

  if (whichMap === 0) {
    console.log("Using USA topojson");
    proj = d3.geo.albersUsa();
    topoURL = DATA_DIRECTORY + "us-states.topojson";
  }

  else if (whichMap === 1) {
    latitude = 38.996815,
    longitude = 34.802075;
    var pScale = 3500,
    center = [latitude, longitude];
    console.log("Using Syria topojson");
    topoURL = DATA_DIRECTORY + "SyriaGovernorates.json";
    proj = d3.geo.conicConformal()
      .center(center)
      .clipAngle(180)
      .scale(pScale)
      .translate(width / 2, height / 2)
      .precision(.1);
  }

  carto = d3.cartogram()
    .projection(proj)
    .properties(function(d) {
      return dataById[d.id];
    })
    .value(function(d) {
      return +d.properties[field];
    });

  d3.json(topoURL, function(topology) {
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
          if (d.properties == "undefined") {
            console.log("d.prop undef!!!");
            return;
          }
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
