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
var userSessionCookie;
var userData;
var proj;
var whichMap = "US";


/*
 * Main program instructions
 */
console.log("Running Cartograms 4 All Web App");

$(document).ready(function() {
    // if not already set, set new cookie.
    var session_id = generateSessionID(16);
    if (readCookie('userSessionCookie') === null) {
        createCookie('userSessionCookie', session_id, 10, '/');
    }
    init();
    //set default data file and topoJSON
    /*map
      .call(updateZoom)
      .call(zoom.event);
    */
});


/*
 * End of main program instructions
 */

//map initialization
function chooseCountry(country){
  whichMap = country;
  //reset();
  clearMenu(); //menu fields need to be cleared before initialization
  init();
}

function init() {
    // Start with default data and topo for user
    // Switch to user data when given


    if (userSessionCookie == null) {
        userSessionCookie = readCookie('userSessionCookie');
    }


    if (whichMap === "US") {
        proj = d3.geo.albersUsa();
        URL_TOPO = DEFAULT_TOPO;
        userData = DEFAULT_DATA;

    } else if (whichMap === "Syria") {
        URL_TOPO = DATA_DIRECTORY + "SyriaGovernorates.topojson";
        userData = DATA_DIRECTORY + "syria.csv";
        setProjection(39, 34.8, 4500);

    } else if (whichMap === "UK") {
        URL_TOPO = DATA_DIRECTORY + "uk.topojson";
        userData = DATA_DIRECTORY + "uk.csv";
        setProjection(-1.775320, 52.298781, 4500);
    }


    if (document.getElementById('input_csv').files[0] != null) {
        //File object is immutable, so it does not rename to make it unique per user in js
        var csv = document.getElementById('input_csv').files[0];
        //Save user input if it is given and override the default
        if (csv != null) {
            saveCSV(csv);
            //userData = USER_DIRECTORY + csv.name;
        } else {
            //Avoid null user file
            userData = DEFAULT_DATA;
        }
        //Add local file usage to avoid async js calls that breaks map
        userData = URL.createObjectURL(csv);
    }




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

  csvFields = getCSVFields(initCartogram, userData);

  var dataById;

  carto = d3.cartogram()
    .projection(proj)
    .properties(function(d) {
      if (dataById != "undefined") {
          return dataById[d.id];
      }
    })
    .value(function(d) {
      if (d != "undefined") {
          return +d.properties[field];
      }
    });


  d3.json(URL_TOPO, function(topology) {
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

    });
  });

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
