/*
 * Global variables
 */
var csvFields;
var map;
var zoom;
var scale = 1;
var scaleBounds = [1, 20];
var layer;
var percent;
var fieldSelect;
var fieldsById;
var body;
var topology;
var carto;
var geometries;
var proj;
var whichMap = "US";
var userSessionCookie;
var userSessionID;

// name of remote CSV being used (based off user's session)
var nameOfLoadFile;
// path to remote CSV being used
var userData;
var fields;
var states;

/*
 * Datasheet Config Variables
 */
var TOPO_DIRECTORY = "data/";
var DEFAULT_DATA = "data/nst_2011.csv";
var DEFAULT_TOPO = "data/us-states.topojson";
var DATA_DIRECTORY = "/examples/";
var PHP_DIRECTORY = "/server/php/";
var UPLOAD_DIRECTORY = "/server/uploader/";
var USER_DIRECTORY = UPLOAD_DIRECTORY + "upload/";

// holds object containing .csv file
var USER_CSV;
// TopoJSON being used
var USER_TOPO;
var CSV_URL;
// raw CSV
var CSV;

/*
 * Flag Variables
 */
var userUploadFlag = false;
var serverDownloadFlag = false;

// true if saving your current session
var saveFlag = false;
// true if you have saved a csv on the server
var haveSavedFlag = false;

/*
 * Main program instructions
 */
console.log("Running Cartograms 4 All Web App");
$(document).ready(function() {
    nameOfLoadFile = "data/nst_2011.csv";

    // Session management
    userSessionID = readCookie('userSessionCookie');

    if (userSessionID === null) {
        userSessionID = generateSessionID(16);
        createCookie('userSessionCookie', session_id, 10, '/');
    }

    shareSessionID(document.getElementById("disabled"));

    //Inital map setup
    var map = d3.select("#map");
    var zoom = d3.behavior.zoom()
        .translate([-38, 32])
        .scale(scale)
        .scaleExtent(scaleBounds)
        .on("zoom", updateZoom);
    var layer = map.append("g")
        .attr("id", "layer");
    var states = layer.append("g")
        .attr("id", "states")
        .selectAll("path");

    init();
});

/*
 * Initialize cartogram application
 */
function init() {
    clearMenu();

    CSV = document.getElementById('input_csv').files[0];

    switch (whichMap) {
        case "US":
            proj = d3.geo.albersUsa();
            URL_TOPO = DEFAULT_TOPO;
            nameOfLoadFile = userData;
            break;
        case "California":
            proj = d3.geo.albersUsa();
            URL_TOPO = TOPO_DIRECTORY + "CAcountiesfinal.topojson";
            userData = DATA_DIRECTORY + "CAcountyages55-59.csv";
            nameOfLoadFile = userData;
            break;
        case "Syria":
            URL_TOPO = TOPO_DIRECTORY + "SyriaGovernorates.topojson";
            userData = DATA_DIRECTORY + "syria.csv";
            nameOfLoadFile = userData;
            setProjection(39, 34.8, 4500);
            break;
        case "UK":
            URL_TOPO = TOPO_DIRECTORY + "uk.topojson";
            userData = DATA_DIRECTORY + "uk.csv";
            nameOfLoadFile = userData;
            setProjection(-1.775320, 52.298781, 4500);
            break;
        default:
            alert("Invalid map selected");
    }

    // CSV uploaded by user
    if (userUploadFlag && !serverDownloadFlag) {
        userData = URL.createObjectURL(CSV);
    }
    // CSV is on server
    if (!userUploadFlag && serverDownloadFlag) {
        userData = "uploader/" + nameOfLoadFile;
    }
    // No CSV loaded, using default
    if (!userUploadFlag && !serverDownloadFlag && whichMap == "US") {
        userData = DEFAULT_DATA;
    }

    // Upload user data to server
    if (saveFlag) {
        if (userUploadFlag && !serverDownloadFlag) {
            // if using CSV uploaded by user
            saveByFile(CSV);
        } else {
            // if using file stored on server
            saveByName(nameOfLoadFile);
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

    /*
     * CSV data loaded into D3
     */
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

    /*
     * Cartogram created from topojson and csv utilizing D3 for visualization
     */
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

            // Region format (just named states because originally cartogram only
            // did states of the USA)
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

/*
 * Set TopoJSON region
 */
function chooseCountry(country) {
    whichMap = country;
    init();
}

/*
 * Used to define non-USA projections for D3
 */
function setProjection(lat, long, pScale) {
    width = 1215;
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

/*
 * Creates new cartogram
 * Processes data to morph D3 visualization
 */
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
        fieldsById = d3.nest()
        .key(function(d) {
            return d.id;
        })
        .rollup(function(d) {
            return d[0];
        })
        .map(fields),
        field = fields[0],
        colors = colorbrewer.RdYlBu[3]
        .reverse()
        .map(function(rgb) {
            return d3.hsl(rgb);
        });

    body = d3.select("body");

    /*
     * Sets cartogram to use user inputted column
     */
    fieldSelect = d3.select("#field")
        .on("change", function(e) {
            field = fields[this.selectedIndex];
            location.hash = "#" + field.id;
        });

    /*
     * Sets input fields to have current CSV's columns
     */
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

/*
 * Checks URL for current col selected
 */
window.onhashchange = function() {
    parseHash(fieldsById);
};

/*
 * Update when available
 */
var deferredUpdate = (function() {
    var timeout;
    return function() {
        var args = arguments;
        clearTimeout(timeout);
        return timeout = setTimeout(function() {
            update.apply(null, arguments);
        }, 10);
    };
})();

/*
 * URL hash for the currently used column
 */
var hashish = d3.selectAll("a.hashish")
    .datum(function() {
        return this.href;
    });
