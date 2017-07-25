// Global variables
var csvFields;
var map;
var zoom;
var scale = 1;
var scaleBounds = [1, 20];
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
var whichMap = "US";
var userSessionCookie; // name of current user's cookie that stores session ID
var userSessionID; // user's session ID as read from cookie
var nameOfLoadFile; // name of remote CSV being used (usually another user's session ID)
var userData; // path to remote CSV being used
var fields;
var states;

// DATASHEET CONFIG
var TOPO_DIRECTORY = "data/";
var DEFAULT_DATA = "data/nst_2011.csv";
var DEFAULT_TOPO = "data/us-states.topojson";
var DATA_DIRECTORY = "/examples/";
var PHP_DIRECTORY = "/server/php/";
var UPLOAD_DIRECTORY = "/server/uploader/"; 
var USER_DIRECTORY = UPLOAD_DIRECTORY + "upload/";
var USER_CSV; // holds object containing .csv file
var USER_TOPO;
var CSV_URL; // DOMString containing URL representing USER_CSV
var CSV; // locally stored csv file object

// Flags
var userUploadFlag = false; // true if using user-uploaded CSV
var serverDownloadFlag = false; //true if using CSV from server
var saveFlag = false; // true if saving your current session
var haveSavedFlag = false; // true if you have saved a csv on the server

/*
 * Main program instructions
 */
console.log("Running Cartograms 4 All Web App");

$(document).ready(function() {
    nameOfLoadFile = "data/nst_2011.csv";
    // if not already set, set new cookie.
    var session_id = generateSessionID(16);
    if (readCookie('userSessionCookie') === null) {
        createCookie('userSessionCookie', session_id, 10, '/');
    }
    //Inital map setup
    var map = d3.select("#map"),
        zoom = d3.behavior.zoom()
        .translate([-38, 32])
        .scale(scale)
        .scaleExtent(scaleBounds)
        .on("zoom", updateZoom),
        layer = map.append("g")
        .attr("id", "layer"),
        states = layer.append("g")
        .attr("id", "states")
        .selectAll("path");
  
    userSessionID = readCookie('userSessionCookie');
    shareSessionID(document.getElementById("disabled"));
    init();
});

//map initialization
function chooseCountry(country) {
    whichMap = country;
    //reset();
    clearMenu(); //menu fields need to be cleared before initialization
    init();
}

//initialization of the entire map
function init() {

    CSV = document.getElementById('input_csv').files[0];

    if (userSessionID == null) {
        userSessionID = readCookie('userSessionCookie');
    }

    if (whichMap === "US") {
        proj = d3.geo.albersUsa();
        URL_TOPO = DEFAULT_TOPO;
        userData = DEFAULT_DATA;
        nameOfLoadFile = userData;
    } else if (whichMap === "Syria") {
        URL_TOPO = TOPO_DIRECTORY + "SyriaGovernorates.topojson";
        userData = DATA_DIRECTORY + "syria.csv";
        nameOfLoadFile = userData;
        setProjection(39, 34.8, 4500);
    } else if (whichMap === "UK") {
        URL_TOPO = TOPO_DIRECTORY + "uk.topojson";
        userData = DATA_DIRECTORY + "uk.csv";
        nameOfLoadFile = userData;
        setProjection(-1.775320, 52.298781, 4500);
    }

    // if using CSV uploaded by user
    if (userUploadFlag && !serverDownloadFlag) {
        userData = URL.createObjectURL(CSV);
    }
    // if using CSV downloaded from server
    if (!userUploadFlag && serverDownloadFlag) {
        userData = "uploader/" + nameOfLoadFile;
    }
    // if using neither, set to defaults only if our map is US
    // default data is only for U.S not other countries' topojson
    if (!userUploadFlag && !serverDownloadFlag && whichMap == "US") {
        userData = DEFAULT_DATA;
    }

    // if you are saving on this init, save currently loaded CSV to the server
    if (saveFlag) {
        if (userUploadFlag && !serverDownloadFlag) {
            saveByFile(CSV); // if using CSV uploaded by user
        } else {
            saveByName(nameOfLoadFile); // if using file stored on server
        }
    }

    map = d3.select("#map");
    zoom = d3.behavior.zoom()
        .translate([-38, 32])
        .scale(scale)
        .scaleExtent(scaleBounds)
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
