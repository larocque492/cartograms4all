// DATASHEET CONFIG
var DATASHEET = "nst_2011.csv";
var DATA_DIRECTORY = "data/";
var DATA = DATA_DIRECTORY + DATASHEET;
var USER_CSV; // holds object containing .csv file
var USER_TOPO;
var CSV_URL; // DOMString containing URL representing USER_CSV
var SESSION_ID;

var fields;
var states;


function getCSVFields(callback) {
  var dataset = Papa.parse(USER_CSV, {
    download: true,
    complete: function(results) {
      return parseFields(results.data, callback);
    }
  });
  CSV_URL = URL.createObjectURL(USER_CSV); // create URL representing USER_CSV
}



function generateSessionID(length) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';

  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// writes string_to_save to app/php/settings/<session_id>.json
function writeToServer(session_id, string_to_save) {
  var data = new FormData();
  data.append("data", string_to_save);
  data.append("name", session_id);
  var XHR = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
  XHR.open('post', 'php/importSettings.php', true);
  XHR.send(data);
}

// returns contents from app/php/settings/<session_id>.json as a string
function readFromServer(session_id) {
  var return_string;
  var data = new FormData();
  data.append("name", session_id);
  var XHR = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
  //XHR.responseType = 'text';
  XHR.onload = function() {
    if (XHR.readyState === XHR.DONE) {
      return_string = XHR.responseText;
    }
  }
  XHR.open('post', 'php/exportSettings.php', false);
  XHR.send(data);
  return return_string;
}

//Save CSV to uploader/upload path via an ajax call
//The saved CSV can be use for other user as it is public
function saveCSV(userCSV) {

  var data = new FormData();
  data.append("input_csv", userCSV);

  $.ajax({
    url: 'uploader/upload-manager.php',
    type: 'POST',
    data: data,
    cache: false,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    success: function(data, textStatus, jqXHR) {
      if (typeof data.error === 'undefined') {
        // Success so call function to process the form
        //submitForm(event, data);
	    console.log('Success' + textStatus);
      } else {
        // Handle errors here
        console.log('ERRORS: ' + data.error);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // Handle errors here
      console.log('ERRORS: ' + textStatus);
      // STOP LOADING SPINNER
    }
  });
}

//Send fields array back inside the called function
function parseFields(data, callback) {
  fields = [];
  fields.push({
    name: "None",
    id: "none"
  });
  for (var i = 0; i < data[0].length; i++) {
    var field = data[0][i];
    fields.push({
      name: field,
      id: field,
      key: field
    });
  }
  callback(fields);
}

function updateZoom() {
  var scale = zoom.scale();
  layer.attr("transform",
    "translate(" + zoom.translate() + ") " +
    "scale(" + [scale, scale] + ")");
}

/*
 * Original graph that is loaded
 */
function reset() {
  stat.text("");
  body.classed("updating", false);

  var features = carto.features(topology, geometries),
    path = d3.geo.path()
    .projection(proj);

  states.data(features)
    .transition()
    .duration(750)
    .ease("linear")
    .attr("fill", "#fff")
    .attr("d", path);

  states.select("title")
    .text(function(d) {
      return d.properties.NAME;
    });
}

function update() {
  var start = Date.now();

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

  var color = d3.scale.linear()
    .range(colors)
    .domain(lo < 0 ? [lo, 0, hi] : [lo, d3.mean(values), hi]);


  // normalize the scale to positive numbers
  var scale = d3.scale.linear()
    .domain([lo, hi])
    .range([1, 1000]);

  // tell the cartogram to use the scaled values
  carto.value(function(d) {
    return scale(value(d));
  });

  // generate the new features, pre-projected
  var features = carto(topology, geometries).features;

  // update the data
  states.data(features)
    .select("title")
    .text(function(d) {
      return [d.properties.NAME, fmt(value(d))].join(": ");
    });

  states.transition()
    .duration(750)
    .ease("linear")
    .attr("fill", function(d) {
      return color(value(d));
    })
    .attr("d", carto.path);

  var delta = (Date.now() - start) / 1000;
}


function parseHash(fieldsById) {
    var parts = location.hash.substr(1).split("/"),
        desiredFieldId = parts[0];
    desiredYear = +parts[1];
    var field = fieldsById[desiredFieldId] || fields[0];
    fieldSelect.property("selectedIndex", fields.indexOf(field));

    if (field.id === "none") {

        reset();

    } else

    deferredUpdate();
    location.replace("#" + field.id);

    hashish.attr("href", function (href) {
        return href + location.hash;
    });
}

/**Inital map setup **/
var map = d3.select("#map"),
    zoom = d3.behavior.zoom()
        .translate([-38, 32])
        .scale(scale)
        .scaleExtent([0.5, 10.0])
        .on("zoom", updateZoom),

layer = map.append("g")
  .attr("id", "layer"),
  states = layer.append("g")
  .attr("id", "states")
  .selectAll("path")
  .call(zoom);

updateZoom();
