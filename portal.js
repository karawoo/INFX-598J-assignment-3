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

// Colors for genera
// Source: http://jnnnnn.blogspot.com.au/2015/10/selecting-different-colours-for.html
var col = d3.scale.ordinal()
        .domain(["Dipodomys", "Chaetodipus", "Onychomys", "Reithrodontomys",
                  "Peromyscus", "Perognathus", "Neotoma", "Ammospermophilus",
                  "Amphispiza", "Spermophilus", "Sigmodon", "Sylvilagus",
                  "Pipilo", "Campylorhynchus", "Baiomys", "Callipepla",
                  "Calamospiza", "Rodent", "Pooecetes", "Sceloporus", "Lizard",
                  "Sparrow", "Ammodramus", "Cnemidophorus", "Crotalus",
                 "Zonotrichia"])
        .range(["#a0cb76", "#6aa3d5", "#dcaf98", "#b6692e", "#a76a59",
        "#04908e", "#d771ab", "#a69683", "#8268d0", "#72ab79", "#f70c8b",
        "#ebaa4c", "#9ce7b8", "#5f837a", "#df708c", "#ad9c32", "#39ffc2",
        "#d28388", "#79d5f9", "#e35eff", "#ffaf72", "#55e0b3", "#e8c0fe",
        "#6a69ed", "#fe07d3", "#0c86af"]);

// Tooltips for points
var tooltip = d3.select("body").append("div") .attr("class", "tooltip")
        .style("opacity", 0);


// Function to draw the visualization
function drawVis(data) {
    var circles = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.weight);  })
            .attr("cy", function(d) { return y(d.hindfoot_length);  })
            .attr("r", 5)
            .style("fill", function(d) { return col(d.genus); })
            .style("stroke", function(d) {return col(d.genus); })
            .on("mouseover", function(d) { tooltip.transition()
                                           .duration(50)
                                           .style("opacity", .9);
                                           tooltip.html(d.genus + " " + d.species
                                                        + "<br>Date: " + d.year
                                                        + "-" + d.month + "-" +
                                                        d.day + "<br>Plot type: " +
                                                        d.plot_type)
                                           .style("left", (d3.event.pageX + 14)
                                                  + "px")
                                           .style("top", (d3.event.pageY - 28)
                                                  + "px"); })
            .on("mouseout", function(d) { tooltip.transition()
                                          .duration(500)
                                          .style("opacity", 0);});
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
