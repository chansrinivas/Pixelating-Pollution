// california.js

var svgMap = d3.select("#map"),
    widthMap = +svgMap.attr("width"),
    heightMap = +svgMap.attr("height");

var div = d3
    .select('.container')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

// Load GeoJSON file
d3.json("https://gist.githubusercontent.com/chansrinivas/166bfa74d14f82284e4edfec66a7e9e6/raw/8d3298de989743e5949ca58bd156c905e762562a/california-counties.geojson")
    .then(function (geojson) {
        // Define projection
        var projection = d3.geoMercator()
            .fitSize([widthMap, heightMap], geojson);

        // Define path generator
        var path = d3.geoPath()
            .projection(projection);

        // Load CSV file
        d3.csv("https://gist.githubusercontent.com/chansrinivas/9ede4262a90ffa1dd4ee68c822d8bba3/raw/7663f5d9567cdde3280032391a8e425987ef496c/aqi-ca.csv").then(function (data) {
            // Convert AQI values to numbers
            data.forEach(function (d) {
                d.AQI = +d.AQI;
            });

            // Define color scale based on AQI values
            var colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
                .domain([90, 5]);

            // Bind data and create one path per GeoJSON feature
            svgMap.selectAll("path")
                .data(geojson.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", function (d) {
                    // Match GeoJSON feature with data from CSV file
                    var countyFIPS = d.properties.County_FIPS_ID;
                    var matchingData = data.find(function (d) { return d.FIPS === countyFIPS; });
                    if (matchingData) {
                        return colorScale(matchingData.AQI);
                    } else {
                        return "#ccc"; // Default color for missing data
                    }
                })
                .on("mouseover", function (event, d) {
                    d3.select(this).raise().transition().duration(100).attr("transform", "scale(1.06)");
                    div
                        .html(`County: ${d.properties.CountyName}`)
                        .style('left', (event.pageX) + 'px')
                        .style('top', (event.pageY + 20) + 'px')
                        .style('opacity', 1);
                })
                .on("mouseout", function () {
                    d3.select(this).transition().duration(100).attr("transform", "scale(1)");
                    div.style('opacity', 0);
                });

            // Create legend
            // Create legend
var legendData = [5, 20, 35, 50, 65, 80, 90]; // Adjust legend values as needed
var legend = d3.select("#legend")
    .append("svg")
    .attr("width", 410) // Adjust the width to accommodate horizontal legend
    .attr("height", 100); // Adjust the height as needed

// Add legend title
legend.append("text")
    .attr("class", "legendTitle")
    .attr("x", 1)
    .attr("y", 15)
    .text("AQI Index");

legend.selectAll(".legendRect")
    .data(legendData)
    .enter().append("rect")
    .attr("class", "legendRect")
    .attr("x", function (d, i) { return i * 50; }) // Adjust the spacing between legend items
    .attr("y", 20)
    .attr("width", 40)
    .attr("height", 15)
    .style("fill", function (d) { return colorScale(d); });

legend.selectAll(".legendText")
    .data(legendData)
    .enter().append("text")
    .attr("class", "legendText")
    .attr("x", function (d, i) { return i * 50 + 15; }) // Adjust the spacing between legend items and the text position
    .attr("y", 55)
    .text(function (d) { return d; });
            });
    })
    .catch(function (error) {
        console.log("Error loading data:", error);
    });
