/*
 * Global variables
 */
var csvFields;
var map;
var zoom;
var scale = 0.5;
var scaleBounds = [0.5, 10];
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

var PROJ_DIRECTORY = "/home/jl/cartograms4all"; //temporary catch-all fix because filepaths are misbehaving
//^ make this your own project's directory!
var TOPO_DIRECTORY = PROJ_DIRECTORY + "/app/data/";
var DEFAULT_DATA = PROJ_DIRECTORY + "/app/data/nst_2011.csv";
var DEFAULT_TOPO = PROJ_DIRECTORY + "/app/data/us-states.topojson";
var DATA_DIRECTORY = PROJ_DIRECTORY + "/examples/";
var PHP_DIRECTORY = PROJ_DIRECTORY + "/server/php/";
var UPLOAD_DIRECTORY = PROJ_DIRECTORY + "/server/uploader/";
var USER_DIRECTORY = UPLOAD_DIRECTORY + "/upload/";

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
        createCookie('userSessionCookie', userSessionID, 10, '/');
    }

    shareSessionID(document.getElementById("disabled"));

    //Inital map setup
    map = d3.select("#map");
    zoom = d3.behavior.zoom()
        .translate([-38, 32])
        .scale(scale)
        .scaleExtent(scaleBounds)
        .on("zoom", updateZoom);
    layer = map.append("g")
        .attr("id", "layer");
    states = layer.append("g")
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
            nameOfLoadFile = DEFAULT_DATA;
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

    // csvFields = getCSVFields(initCartogram, userData);

    console.log("load file: ", nameOfLoadFile);
    var csvfile = nameOfLoadFile;
    var parsedData;

    $.get(csvfile, function (data) {
        $(".result").html(data);
        parsedData = Papa.parse(data);
        console.log("Load performed, parsedData: ", parsedData);
    });

    $(document).ready(function() { //waits for async jquery get request
        console.log("parsed csv values", parsedData);
        console.log("parsed csv labels", parsedData.data[0]);

        csvFields = [];
        csvFields.push({
            name: "None",
            id: "none"
        });

        for (var i = 0; i < parsedData.data[0].length; i++) {
            var field = parsedData.data[0][i];
            csvFields.push({
                name: field,
                id: field,
                key: field
            });
        }

        console.log("csvFields: ", csvFields);
        console.log("Proj: ", proj);
        var dataById;
        carto = d3.cartogram()
            .projection(proj)
            .properties(function(d) {
                if (dataById !== "undefined") {
                    // console.log("dataById, ", dataById[d.id]);
                    return dataById[d.id];
                }
            })
            .value(function(d) {
                if (d !== "undefined") {
                    return +d.properties[field];
                }
            });
    
        /*
         * Cartogram created from topojson and csv utilizing D3 for visualization
         */
        d3.json(URL_TOPO, function(topo) {
            topology = topo;
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
                // console.log("dataById", dataById, "features", features, "path", path);
                // console.log("update! ", states);
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

        initCartogram(csvFields);


    });

    // while (returnData === undefined) {
    //     console.log("csvdata! ", this.returnData);
    // }

    /*
     * CSV data loaded into D3
     */
}

function update() {
    // Current column being rendered
    var key = field.key;
    var fmt = (typeof field.format === "function") ?
        field.format :
        d3.format(field.format || ","),
        value = function(d) {
            return +d.properties[key];
        },
        values = states.data()
        .map(value)
        .filter(function(n) {
            return !isNaN(n);
        })
        .sort(d3.ascending),
        lo = values[0],
        hi = values[values.length - 1];

    // Sets color based off selecte data
    var color = d3.scale.linear()
        .range(colors)
        .domain(lo < 0 ? [lo, 0, hi] : [lo, d3.mean(values), hi]);

    // Normalize the scale to positive numbers
    var scale = d3.scale.linear()
        .domain([lo, hi])
        .range([1, 1000]);

    console.log("scaled")

    // Cartogram to use the scaled values
    carto.value(function(d) {
        return scale(value(d));
    });

    // Generate the new features, pre-projected
    var features = carto(topology, geometries).features;
    console.log("Updating cartogram...");
    // Update the data on the D3 visualization
    states.data(features)
        .select("title")
        .text(function(d) {
            return [d.properties.NAME, fmt(value(d))].join(": ");
        });

    // Animation to make it not jump
    states.transition()
        .duration(750)
        .ease("linear")
        .attr("fill", function(d) {
            return color(value(d));
        })
        .attr("d", carto.path);
}


/*
 * Set TopoJSON region
 */
function chooseCountry(region) {
    whichMap = region;
    console.log("region chosen: ", region);
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
    console.log("FIELDS! ", fields);
    var color;
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


    console.log("Fields in initcarto!", fieldsById); 

    body = d3.select("body");

    /*
     * Sets cartogram to use user inputted column
     */
    fieldSelect = d3.select("#field")
        .on("change", function(e) {
            field = fields[this.selectedIndex];
            console.log("field selected: ", field);
            location.hash = "#" + field.id;
            update();
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
    console.log("fields in onhashchange", fieldsById);
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
            if (carto !== undefined) update.apply(null, arguments);
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
