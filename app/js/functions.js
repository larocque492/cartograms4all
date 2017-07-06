// DATASHEET CONFIG
var DATASHEET = "nst_2011.csv";
var DATA_DIRECTORY = "data/";
var DATA = DATA_DIRECTORY + DATASHEET;

var fields;

function getCSVFields(callback)
{
  // TODO: Have this be loaded from the frontend form instead
  var dataset = Papa.parse("/app/data/nst_2011.csv", {
      download: true,
      complete: function(results) {
        return parseFields(results.data, callback);
      }
  });
}

function parseFields(data, callback)
{
  fields = [];
  fields.push({name: "None", id: "none"});
  for(var i = 0; i < data[0].length; i++)
  {
    var field = data[0][i];
    fields.push({name: field, id: field, key: field});
  }
  callback(fields);
}


function updateZoom() {
    var scale = zoom.scale();
    layer.attr("transform",
        "translate(" + zoom.translate() + ") " +
        "scale(" + [scale, scale] + ")");
}

function init() {
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
        .attr("fill", "#fafafa")
        .attr("d", path);

    states.append("title");

    parseHash();
}

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
        .attr("fill", "#fafafa")
        .attr("d", path);

    states.select("title")
        .text(function(d) {
            return d.properties.NAME;
        });
}

function update() {
    var start = Date.now();
    body.classed("updating", true);

    var key = field.key.replace("%d", year),
        fmt = (typeof field.format === "function")
            ? field.format
            : d3.format(field.format || ","),
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
        .domain(lo < 0
            ? [lo, 0, hi]
            : [lo, d3.mean(values), hi]);

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

    console.log("update",states);
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
    stat.text(["calculated in", delta.toFixed(1), "seconds"].join(" "));
    body.classed("updating", false);
}

function parseHash() {
    var parts = location.hash.substr(1).split("/"),
        desiredFieldId = parts[0],
        desiredYear = +parts[1];

    console.log(fields);
    var field = fieldsById[desiredFieldId] || fields[0];
    year = (years.indexOf(desiredYear) > -1) ? desiredYear : years[0];

    fieldSelect.property("selectedIndex", fields.indexOf(field));

    if (field.id === "none") {

        //yearSelect.attr("disabled", "disabled");
        reset();

    } else {
/*
        if (field.years) {
            if (field.years.indexOf(year) === -1) {
                year = field.years[0];
            }
            yearSelect.selectAll("option")
                .attr("disabled", function(y) {
                    return (field.years.indexOf(y) === -1) ? "disabled" : null;
                });
        } else {
            yearSelect.selectAll("option")
                .attr("disabled", null);
        }

        yearSelect
            .property("selectedIndex", years.indexOf(year))
            .attr("disabled", null);
*/
        deferredUpdate();
        location.replace("#" + [field.id, year].join("/"));

        hashish.attr("href", function(href) {
            return href + location.hash;
        });
    }
}
