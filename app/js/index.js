// Global variables
var csvFields;
var map;
var zoom;
var layer;
var percent;
var fieldSelect;
var stat;
var body;
/*
 * Main program instructions
 */
$(document).ready(function()
{
  init();
});
/*
 * End of main program instructions
 */

 
function init()
{
  csvFields = getCSVFields(initCartogram);
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

function initCartogram(csvFields)
{
  fields = csvFields;
  // Data info for the cartogram
  percent = (function() {
          var fmt = d3.format(".2f");
          return function(n) { return fmt(n) + "%"; };
      })(),
      fields = csvFields,
      // TODO: Make this customizable
      // NOTE: Might just have this detect if there are digits at the end of the column or beginning, and if there are then use those as a year
      years = [2010, 2011],
      fieldsById = d3.nest()
          .key(function(d) { return d.id; })
          .rollup(function(d) { return d[0]; })
          .map(fields),
      field = fields[0],
      year = years[0],
      colors = colorbrewer.RdYlBu[3]
          .reverse()
          .map(function(rgb) { return d3.hsl(rgb); });

          body = d3.select("body");
          stat = d3.select("#status");

          fieldSelect = d3.select("#field")
              .on("change", function(e) {
                  field = fields[this.selectedIndex];
                  location.hash = "#" + [field.id, year].join("/");
              });

          fieldSelect.selectAll("option")
              .data(fields)
              .enter()
              .append("option")
              .attr("value", function(d) { return d.id; })
              .text(function(d) { return d.name; });

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

          map = d3.select("#map");
          zoom = d3.behavior.zoom()
              .translate([-38, 32])
              .scale(.94)
              .scaleExtent([0.5, 10.0])
              .on("zoom", updateZoom);
          layer = map.append("g")
              .attr("id", "layer"),
          states = layer.append("g")
              .attr("id", "states")
              .selectAll("path");

          updateZoom();
}

var proj = d3.geo.albersUsa(),
    topology,
    geometries,
    rawData,
    dataById = {},
    carto = d3.cartogram()
        .projection(proj)
        .properties(function(d) {
            return dataById[d.id];
        })
        .value(function(d) {
            return +d.properties[field];
        });

window.onhashchange = function() {
    parseHash();
};

var segmentized = location.search === "?segmentized",
    url = ["data",
        segmentized ? "us-states-segmentized.topojson" : "us-states.topojson"
    ].join("/");
d3.json(url, function(topo) {
    topology = topo;
    geometries = topology.objects.states.geometries;
    d3.csv(DATA_DIRECTORY + DATASHEET, function(data) {
        rawData = data;
        dataById = d3.nest()
            .key(function(d) { return d.NAME; })
            .rollup(function(d) { return d[0]; })
            .map(data);
        init();
    });
});

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
