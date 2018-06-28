/*
 * Returns array of CSV headers
 * Used for data column selection
 */
// function getCSVFields(callback, CSV) {

//     var fields = [];

//     function parseFields(data, callback) {
//         console.log("callback, ", data);
//         fields.push({
//             name: "None",
//             id: "none"
//         });
//         for (var i = 0; i < data[0].length; i++) {
//             var field = data[0][i];
//             fields.push({
//                 name: field,
//                 id: field,
//                 key: field
//             });
//         }
//         callback(fields);
//     }
    
//     console.log("getCSVFields", CSV);
//     var dataset = Papa.parse(CSV, {
//         download: true,
//         complete: function(results) {
//             console.log("Stuff.");
//             fields = parseFields(results.data, callback);
//             return parseFields(results.data, callback);
//             // console.log("parsedFields!!!  ", parsedFields);
//             //return fields;
//         }
//     });
// }

/*
 * Parse fields from papa parsed object
 */
function parseFields(data, callback) {
    console.log("callback, ", data);
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
 * Loads topojson in and sets regions
 */
function initTopo() {
    var features = carto.features(topology, geometries),
        path = d3.geo.path()
        .projection(proj);
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

    parseHash();
}

/*
 * Original graph that is loaded
 */
function reset() {
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

/*
 * Empty the CSV column input menu
 */
function clearMenu() {
    var select = document.getElementById("field");
    select.options.length = 0;
}

/*
 * Anything that needs to be periodically updated getCSVFields
 * run in here
 */

/*
 * Gets application data from url hash
 */
function parseHash(fieldsById) {
    var parts = location.hash.substr(1).split("/"),
        desiredFieldId = parts[0],
        desiredYear = +parts[1];

    var field = fieldsById[desiredFieldId] || fields[0];

    fieldSelect.property("selectedIndex", fields.indexOf(field));

    if (field.id === "none") {
        reset();
    } else {
        deferredUpdate();
    }
    location.replace("#" + field.id);

    hashish.attr("href", function(href) {
        return href + location.hash;
    });
}
