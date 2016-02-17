
// Set width/height/margins
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var w = 900 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;

// x and y scales 
var x = d3.scale.linear()
        .range([0, w])
        .nice();

var y = d3.scale.linear()
        .range([h, 0])
        .nice();

var xVar = "weight",
    yVar = "hindfoot_length";

// Load data
d3.csv("portal_combined.csv", function(error, data) {
    // Read in the data
    if (error) return console.warn(error);
    data.forEach(function(d) { // Following columns should be numeric
        d.month = +d.month;
        d.day = +d.day;
        d.year = +d.year;
    });
    // Filter out rows with NAs in hindfoot length and weight
    data.filter(function(d){
        if(isNaN(d.hindfoot_length)){
            return false;
        }
        d.hindfoot_length = parseFloat(d.hindfoot_length);
        return true;
    });
    data.filter(function(d){
        if(isNaN(d.weight)){
            return false;
        }
        d.weight = parseFloat(d.weight);
        return true;
    });
    
    // Calculate maxima and minima and use these to set x/y domain
    var xMax = d3.max(data, function(d) { return d[xVar]; }),
        xMin = d3.min(data, function(d) { return d[xVar]; }),
        yMax = d3.max(data, function(d) { return d[yVar]; }),
        yMin = d3.min(data, function(d) { return d[yVar]; });

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    // Draw x axis
    var xAxis = d3.svg.axis()
            .ticks(6)
            .scale(x);

    // Draw y axis
    var yAxis = d3.svg.axis()
            .ticks(7)
            .scale(y)
            .orient("left");

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
                    "#04908e", "#d771ab", "#a69683", "#8268d0", "#72ab79",
                    "#f70c8b", "#ebaa4c", "#9ce7b8", "#5f837a", "#df708c",
                    "#ad9c32", "#39ffc2", "#d28388", "#79d5f9", "#e35eff",
                    "#ffaf72", "#55e0b3", "#e8c0fe", "#6a69ed", "#fe07d3",
                    "#0c86af"]);

    // Tooltips for points
    var tooltip = d3.select("body").append("div") .attr("class", "tooltip")
            .style("opacity", 0);
    
    // Zooming
    var zooming = d3.behavior.zoom()
            .x(x)
            .y(y)
            .scaleExtent([0.5, 10])
            .on("zoom", zoomFun);
    
    // Create SVG
    var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zooming);
    
    // Add x axis label ("Weight")
    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", w)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Weight");

    // Add y axis label ("Hindfoot length")
    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Hindfoot Length");

    // Create svg rectangle
    svg.append("rect")
        .attr("width", w)
        .attr("height", h);

    // Create `objects` to hold points
    var objects = svg.append("svg")
            .classed("objects", true)
            .attr("width", w)
            .attr("height", h);

    // Plot points
    objects.selectAll(".dot")
        .data(data
              .filter(function(d){
                  if(isNaN(d.hindfoot_length)){
                      return false;
                  }
                  d.hindfoot_length = parseFloat(d.hindfoot_length);
                  return true;
              })
              .filter(function(d){
                  if(isNaN(d.weight)){
                      return false;
                  }
                  d.weight = parseFloat(d.weight);
                  return true;
              }))
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("id", function(d) { return d.genus; } ) 
        .attr("r", 5)
        .attr("transform", transform)
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

    

    // Interactive legend
    var legend = svg.selectAll(".legend")
            .data(col.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });
    
    // Draw empty rectangles for legend boxes so borders will still show up when
    // boxes are unselected
    legend.append("rect")
        .attr("x", w + 30)
        .attr("width", 13)
        .attr("height", 13)
        .attr("border", 1)
        .style("stroke", 'black')
        .style("stroke-width", 1)
        .style("fill", 'white')
    ;

    // Draw legend's colored rectangles
    legend.append("rect")
        .attr("class", "fade_rectangle" )
        .attr("id" , function(d) { return d; } ) 
        .attr("x", w + 30)
        .attr("width", 13)
        .attr("height", 13)
        .style("fill", col)
        .style("stroke", 'black')
        .style("stroke-width", 1)
        .style("opacity", 1)
    // When a legend box is clicked, change the opacity of the legend and
    // associated points
        .on("click", function (d, i) {
            var opac = this.style.opacity;
            filterGenus(d, opac);
        });

    // Add legend text
    legend.append("text")
        .attr("x", w + 50)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d;});

    // Filter points by changing opacity to zero
    function filterGenus(id, opac) {
        var newOpac = 1 - opac ;
        // Toggle opacity of the points (and legend box)
        d3.selectAll("#" + id)
            .style("opacity", newOpac);    
    }
    
    // Function to update data based on checkbox selections
    function update() {
        var sexes = d3.selectAll(".filter_button")[0]
                .filter(function(e) { return e.checked; })
                .map(function(e) { return e.value; });

        var plottypes = d3.selectAll(".plot_menu")[0]
                .filter(function(e) { return e.selected; })
                .map(function(e) { return e.value; });

        // Helper function that will return correct display value for each dot
        function display(d) {
            // Check if the current dot's sex and plot type are present in
            // `sexes` and `plottypes`
            if (sexes.indexOf(d.sex) !== -1
                && plottypes.indexOf(d.plot_type) !== -1) {
                return "inline";
            } else {
                return "none";
            }
        }

        // Change display attribute of every dot using display function
        svg.selectAll(".dot").attr("display", display);
    }

    // Update every time a checkbox changes
    d3.selectAll(".filter_options").on("change", function() {
        update();
    });

    // Zooming function
    function zoomFun() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);

        svg.selectAll(".dot")
            .attr("transform", transform);
    }

    function transform(d) {
        return "translate(" + x(d[xVar]) + "," + y(d[yVar]) + ")";
    }
});
