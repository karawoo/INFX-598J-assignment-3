
// Set width/height/margins
var margin = {top: 20, right: 200, bottom: 100, left: 50},
    margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
    w = 960 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%Y").parse;

// Create SVG
var svg = d3.select("body").append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create invisible rect for mouse tracking in the main plot
// svg.append("rect")
//     .attr("width", w)
//     .attr("height", h)                                    
//     .attr("x", 0) 
//     .attr("y", 0)
//     .attr("id", "mouse-tracker")
//     .style("fill", "white"); 

var context = svg.append("g") // Brushing context box container
        .attr("transform", "translate(" + 0 + "," + 410 + ")")
        .attr("class", "context");

// x and y scales 
var x = d3.scale.linear()
        .domain([0, 300])
        .range([0, w]),
    x2 = d3.time.scale()
        .range([0, w]); // Duplicate xScale for brushing ref later

var y = d3.scale.linear()
        .domain([0, 70])
        .range([h, 0]);

// Draw x axis
var xAxis = d3.svg.axis()
        .ticks(6)
        .scale(x),
    xAxis2 = d3.svg.axis() // xAxis2 for brush slider
        .scale(x2)
        .orient("bottom");   

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
        "#04908e", "#d771ab", "#a69683", "#8268d0", "#72ab79", "#f70c8b",
        "#ebaa4c", "#9ce7b8", "#5f837a", "#df708c", "#ad9c32", "#39ffc2",
        "#d28388", "#79d5f9", "#e35eff", "#ffaf72", "#55e0b3", "#e8c0fe",
        "#6a69ed", "#fe07d3", "#0c86af"]);

// Tooltips for points
var tooltip = d3.select("body").append("div") .attr("class", "tooltip")
        .style("opacity", 0);

// Load data
var dataset;
d3.csv("portal_combined.csv", function(error, data) {
    //read in the data
    if (error) return console.warn(error);
    data.forEach(function(d) { // Following columns should be numeric
        d.month = +d.month;
        d.day = +d.day;
        d.year = parseDate(d.year);
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

    // X domain extent
    x.domain(d3.extent(data, function(d) { return d.year; }));
    x2.domain(x.domain()); // duplicate xdomain for brushing reference later

 //for slider part---------------------------------------------------------------

 var brush = d3.svg.brush()//for slider bar at the bottom
    .x(x2) 
    .on("brush", brushed);

  context.append("g") // Create brushing xAxis
      .attr("class", "x axis1")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  var contextArea = d3.svg.area() // Set attributes for area chart in brushing context graph
    .interpolate("monotone")
    .x(function(d) { return x2(d.date); }) // x is scaled to xScale2
    .y0(height2) // Bottom line begins at height2 (area chart not inverted) 
    .y1(0); // Top line of area, 0 (area chart not inverted)

  //plot the rect as the bar at the bottom
  context.append("path") // Path is created using svg.area details
    .attr("class", "area")
    // .attr("d", contextArea(categories[0].values)) // pass first categories data .values to area path generator 
    .attr("fill", "#F1F1F2");
    
  //append the brush for the selection of subsection  
  context.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("height", height2) // Make brush rects same height 
      .attr("fill", "#E6E7E8");  
  //end slider part--------------------------------------------------------------
    
    svg.selectAll(".dot")
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

    
    // Function to update data based on checkbox selections
    function update() {
        var sexes = d3.selectAll(".filter_button")[0]
                .filter(function(e) { return e.checked; })
                .map(function(e) { return e.value; });

        var plottypes = d3.selectAll(".plot_button")[0]
                .filter(function(e) { return e.checked; })
                .map(function(e) { return e.value; });

        // Helper function that will return correct display value for each dot
        function display(d) {
            // Check if the current dot"s sex and plot type are present in
            // `sexes` and `plottypes`
            if (sexes.indexOf(d.sex) !== -1
                && plottypes.indexOf(d.plot_type) !== -1) {
                return "inline";
            } else {
                return "none";
            }
        }

        // change display attribute of every dot using display function
        svg.selectAll(".dot").attr("display", display);
    }

    // update every time a checkbox changes
    d3.selectAll(".filter_options input").on("change", function() {
        update();
    });

    function brushed() {

        x.domain(brush.empty() ? x2.domain() : brush.extent()); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent 

        svg.select(".x.axis") // replot xAxis with transition when brush used
            .transition()
            .call(xAxis);

        // maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
        // yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
        
        svg.select(".y.axis") // Redraw yAxis
            .transition()
            .call(yAxis);   

        // issue.select("path") // Redraw lines based on brush xAxis scale and domain
        //     .transition()
        //     .attr("d", function(d){
        //         return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
            // });
        
    }; 
    
});

