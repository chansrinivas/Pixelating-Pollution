// california.js

var svgMap = d3.select("#map"),
    widthMap = +svgMap.attr("width"),
    heightMap = +svgMap.attr("height");

var div = d3
    .select('.container')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

d3.json("https://gist.githubusercontent.com/chansrinivas/166bfa74d14f82284e4edfec66a7e9e6/raw/8d3298de989743e5949ca58bd156c905e762562a/california-counties.geojson")
    .then(function (geojson) {
        var projection = d3.geoMercator()
            .fitSize([widthMap, heightMap], geojson);

        var path = d3.geoPath()
            .projection(projection);

        d3.csv("https://gist.githubusercontent.com/chansrinivas/9ede4262a90ffa1dd4ee68c822d8bba3/raw/7663f5d9567cdde3280032391a8e425987ef496c/aqi-ca.csv").then(function (data) {
            data.forEach(function (d) {
                d.AQI = +d.AQI;
            });

            var colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
                .domain([90, 5]);

            svgMap.selectAll("path")
                .data(geojson.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", function (d) {
                    var countyFIPS = d.properties.County_FIPS_ID;
                    var matchingData = data.find(function (d) { return d.FIPS === countyFIPS; });
                    if (matchingData) {
                        return colorScale(matchingData.AQI);
                    } else {
                        return "#ccc"; 
                    }
                })
                .on("mouseover", function (event, d) {
                    console.log("x: ", event.pageX)
                    var countyFIPS = d.properties.County_FIPS_ID;
                    var matchingData = data.find(function (d) { return d.FIPS === countyFIPS; });
                    if (matchingData) {
                        console.log(matchingData.AQI);
                    } else {
                        console.log("None"); 
                    }

                    d3.select(this).raise().transition().duration(100).attr("transform", "scale(1.03)");
                    div
                        .html(`County: ${d.properties.CountyName} <br> AQI: ${matchingData.AQI}`)
                        .style('left', 40 + 'px')
                        .style('top', 130 + 'px')
                        .style('opacity', 1);
                })
                .on("mouseout", function () {
                    d3.select(this).transition().duration(100).attr("transform", "scale(1)");
                    div.style('opacity', 0);
                });

            
            var legendData = [5, 20, 35, 50, 65, 80, 90];
            var legend = d3.select("#legend")
                .append("svg")
                .attr("width", 410) 
                .attr("height", 100); 

            legend.append("text")
                .attr("class", "legendTitle")
                .attr("x", 1)
                .attr("y", 15)
                .text("AQI Index");

            legend.selectAll(".legendRect")
                .data(legendData)
                .enter().append("rect")
                .attr("class", "legendRect")
                .attr("x", function (d, i) { return i * 50; }) 
                .attr("y", 20)
                .attr("width", 40)
                .attr("height", 15)
                .style("fill", function (d) { return colorScale(d); });

            legend.selectAll(".legendText")
                .data(legendData)
                .enter().append("text")
                .attr("class", "legendText")
                .attr("x", function (d, i) { return i * 50 + 15; }) 
                .attr("y", 55)
                .text(function (d) { return d; });
        });
    })
    .catch(function (error) {
        console.log("Error loading data:", error);
    });
