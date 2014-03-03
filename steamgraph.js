/*
 https://wiki.fitbit.com/display/API/API-Get-Time-Series
 https://wiki.fitbit.com/display/API/API+Explorer
 http://api.fitbit.com/1/user/229T6N/sleep/minutesAsleep/date/2013-12-01/1m.json

 Modelled after http://bl.ocks.org/mbostock/4060954#index.html
 */

var n = 4; // number of layers
var m = 30; // number of samples per layer

var xSelector = function (d) {
    var dayString = d.dateTime.substring(d.dateTime.length - 2, d.dateTime.length);
    return Number(dayString);
};

var stack = d3.layout.stack().offset("wiggle")
    .values(function (d) {
        return d.values;
    })
    .x(xSelector)
    .y(function (d) {
        return Number(d.value);
    });

var layers0 = stack([minutesAsleep, minutesLightlyActive, minutesFairlyActive, minutesVeryActive]);

var width = 960,
    height = 500;

var x = d3.scale.linear()
    .domain([1, m])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 16 * 60])
    .range([height, 0]);

var color = d3.scale.linear()
    .range(["#aad", "#556"]);

var area = d3.svg.area()
    .x(function (d) {
        return x(xSelector(d));
    })
    .y0(function (d) {
        return y(d.y0);
    })
    .y1(function (d) {
        return y(d.y0 + d.y);
    });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.selectAll("path")
    .data(layers0)
    .enter().append("path")
    .attr("d", function (d) {
        return area(d.values);
    })
    .attr("title", function (d) {
        return d.label;
    })
    .style("fill", function () {
        return color(Math.random());
    });

$(document).tooltip()

