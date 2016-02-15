
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
                "#04908e", "#d771ab", "#a69683", "#8268d0", "#72ab79", "#f70c8b",
                "#ebaa4c", "#9ce7b8", "#5f837a", "#df708c", "#ad9c32", "#39ffc2",
                "#d28388", "#79d5f9", "#e35eff", "#ffaf72", "#55e0b3", "#e8c0fe",
                "#6a69ed", "#fe07d3", "#0c86af"]);

// Tooltips for points
var tooltip = d3.select("body").append("div") .attr("class", "tooltip")
        .style("opacity", 0);

// Load data
var mytype;
var portal;
d3.csv("portal_combined.csv", function(error, data) {
    //read in the data
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
    
    // Create summary data set with average weight and hindfoot length by genus.
    // This works but the data isn't accessible in the global namespace
    
    // var portal_avg = d3.nest()
    //         .key(function(d) { return d.genus; })
    //         .rollup(function(v) {
    //             return {
    //                 mean_weight: d3.mean(v, function(d) { return d.weight; }),
    //                 mean_hindfoot_length: d3.mean(v, function(d) {
    //                     return d.hindfoot_length; })
    //             };
    //         })
    //         .entries(data);


    // Slider handler function
    $(function() {
        $( "#year" ).slider({
            range: true,
            min: 1977,
            max: 2002,
            values: [ 1977, 2002 ],
            slide: function( event, ui ) {
                $( "#yearamount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                filterData("year", ui.values); } });
        $( "#yearamount" ).val( $( "#year" ).slider( "values", 0 ) +
                                " - " + $( "#year" ).slider( "values", 1 ) ); });

    var attributes = ["year"];
    var maxYear = 2002; // d3.max(portal, function(d) { return +d.year; });
    var minYear = 1977; // d3.min(portal, function(d) { return +d.year; });
    var ranges = [minYear, maxYear];

    function filterData(attr, values){
        for (var i = 0; i < attributes.length; i++){
            if (attr == attributes[i]){
                ranges[i] = values;
            }
        }
        var ndata = []; //local variable for filtered data
        if(mytype==="all"){ //if the type is all, just filter the quantiative variables based on ranges
            data.forEach(function(d) {
                for (i = 0; i < attributes.length; i++){
                    if (d[attributes[i]] < ranges[i][0] || d[attributes[i]] > ranges[i][1]){
                        return false;
                    }
                }
                ndata.push(d);
            });
        }else{ //if the type is not all, filter the quantitative variables but continue to filter by the last selected type
            data.forEach(function(d) {
                for (i = 0; i < attributes.length; i++){
                    if (d["type"] != mytype || d[attributes[i]] < ranges[i][0] || d[attributes[i]] > ranges[i][1]){
                        return false;
                    }
                }
                ndata.push(d);
            });
        }
        drawVis(ndata);
    }


    function filterType(mtype) {
        mytype=mtype; //set a global variable called mytype to track the last dropdown type selection
        var ndata = [];
        if(mytype==="all"){ //if type is all, take the original unfiltered data, and just filter by last selected slider range
            data.forEach(function(d) {
                for (var i = 0; i < attributes.length; i++){
                    if (d[attributes[i]] < ranges[i][0] || d[attributes[i]] > ranges[i][1]){
                        return false;
                    }
                }
                ndata.push(d);
            });
        }else{ //if a certain type is selected, filter to only that type and use the attribute ranges
            data.forEach(function(d) {
                for (i = 0; i < attributes.length; i++){
                    if (d["type"] != mytype || d[attributes[i]] < ranges[i][0] || d[attributes[i]] > ranges[i][1]){
                        return false;
                    }
                }
                ndata.push(d);
            });
        }
        portal = ndata;
        drawVis(ndata);
    }

    
    // portal = data;
    // drawVis(portal);

   
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



function drawVis() {
    svg.selectAll(".dot")
        .data(portal
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
    // function update() {
    //     var sexes = d3.selectAll(".filter_button")[0]
    //             .filter(function(e) { return e.checked; })
    //             .map(function(e) { return e.value; });

    //     var plottypes = d3.selectAll(".plot_button")[0]
    //             .filter(function(e) { return e.checked; })
    //             .map(function(e) { return e.value; });
        
    //     // Helper function that will return correct display value for each dot
    //     function display(d) {
    //         // Check if the current dot"s sex and plot type are present in
    //         // `sexes` and `plottypes`
    //         if (sexes.indexOf(d.sex) !== -1
    //             && plottypes.indexOf(d.plot_type) !== -1) {
    //             return "inline";
    //         } else {
    //             return "none";
    //         }
    //     }

    //     // change display attribute of every dot using display function
    //     svg.selectAll(".dot").attr("display", display);
    // }
    
    // Run update() once, otherwise slider won't appear until a checkbox is clicked
    // update();
    
    // update every time a checkbox changes
    // d3.selectAll(".filter_options input").on("change", function() {
    //     update();
    // });

    // d3.selectAll(".slider-range input").on("change", function() {
    //     update();
    // });

}

