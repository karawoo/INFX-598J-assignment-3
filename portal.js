// Load data
var dataset;
d3.csv("portal_combined.csv", function(error, portal) {
    //read in the data
    if (error) return console.warn(error);
    portal.forEach(function(d) { // Following columns should be numeric
        d.month = +d.month;
        d.day = +d.day;
        d.year = +d.year;
        d.hindfoot_length = +d.hindfoot_length;
        d.weight = +d.weight;
    });
    dataset=portal;
    drawVis(dataset);
});

// Set width/height/margins
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var w = 900 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;

// Create SVG
var svg = d3.select("body").append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x and y scales 
var x = d3.scale.linear()
        .domain([0, 300])
        .range([0, w]);

var y = d3.scale.linear()
        .domain([0, 70])
        .range([h, 0]);

// Function to draw the visualization
function drawVis(data) {
    var circles = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.weight);  })
            .attr("cy", function(d) { return y(d.hindfoot_length);  })
            .attr("r", 4)
            .style("stroke", "black")
            .style("opacity", 0.5);
}


// Draw x axis
var xAxis = d3.svg.axis()
        .ticks(6)
        .scale(x);

// Add x axis label ("Weight")
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
    .append("text")
    .attr("x", w)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Weight");

// Draw y axis
var yAxis = d3.svg.axis()
        .ticks(7)
        .scale(y)
        .orient("left");

// Add y axis label ("Hindfoot length")
svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Hindfoot Length");
