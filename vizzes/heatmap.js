// <!-- <!doctype html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>D3 Heat Map</title>
//     <style>
//         body {
//             font-family: 'Arial', sans-serif;
//         }

//         #chart-container {
//             position: relative;
//         }


//         .chart-background {
//             fill: #f0f0f0;
//         }

//         .heatmap-rect {
//             stroke: #fff;
//             stroke-width: 1.2px;

//         }

//         .chart-label {
//             font-size: 18px;
//             font-weight: bold;
//             fill: #140431;
//         }
//     </style>

//     <script src="https://d3js.org/d3.v7.min.js"></script>
//     <script src="https://d3js.org/d3-scale-chromatic.v2.min.js"></script>
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>

// </head>

// <body>
//     <div id="chart-container"></div>
//     <script> -->

        var canvasWidth = 1000;
        var canvasHeight = 500;
        var margin1 = {
            top: 50,
            right: 600,
            bottom: 150,
            left: 150,
        };

        var svg1 = d3
            .select('#chart-container')
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);


        var width1 = 650;
        //canvasWidth - margin1.left - margin1.right;
        // console.log("Width: ",width1)
        var height1 = canvasHeight - margin1.top - margin1.bottom;

        var yScale = d3
            .scaleBand()
            .range([0, height1])
            .padding(0.03);
        var xScale = d3
            .scaleBand()
            .range([0, width1])
            .padding(0.05);

        var heatmapColor = d3
            .scaleSequential()
            .interpolator(d3.interpolateRdYlGn) // Using a green-to-red color scale
            .domain([140, 20]); // Reversed domain to have green for lower values and red for higher values


        var container_g = svg1
            .append('g')
            .attr('transform', 'translate(' + margin1.left + ',' + margin1.top + ')',);

        d3.csv(
            'https://gist.githubusercontent.com/chansrinivas/fd27e6043da02a8bde32d72a8440dd32/raw/00f25153eb2f1c10f1b653993c54cfb086605c4e/ozone.csv',
        ).then((data) => {
            yScale.domain(
                data.map(function (d) {
                    return d.Zone;
                }),
            );

            xScale.domain(
                data.map(function (d) {
                    return d.Month;
                }),
            );

            // Add chart title
            svg1
                .append('text')
                .attr('class', 'chart-label')
                .attr('x', canvasWidth / 4.6)
                .attr('y', margin1.top / 2)
                .text('Ground Level Ozone in Bay Area in 2023');

            // Add x-axis and label
            container_g
                .append('g')
                .attr('transform', 'translate(0, ' + height1 + ')')
                .call(d3.axisBottom(xScale))
                .append('text')
                .attr('y', 45)
                .attr('x', width1 / 2)
                .attr('font-family', 'sans-serif')
                .attr('font-size', '14px')
                .attr('fill', '#140431')
                // .text('Month');

            // Add y-axis and label
            container_g
                .append('g')
                .call(d3.axisLeft(yScale))
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', -120)
                .attr('x', -height1 / 2.4)
                .attr('dy', '1em')
                .attr('font-family', 'sans-serif')
                .attr('font-size', '14px')
                .attr('fill', '#140431')
                // .text('Location');

            // Add legend
            svg1.append("g")
                .attr("class", "legendSequential")
                .attr("transform", "translate(130,440)");

            var legendSequential = d3.legendColor()
                .title("Ground level Ozone")
                .shapeWidth(70)
                .cells(5)
                .orient("horizontal")
                .scale(heatmapColor);

            svg1.select(".legendSequential")
                .call(legendSequential)
                .selectAll("text")
                .attr("font-size", "13px");


            var tooltip = d3.select("#chart-container") // Corrected selection
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("position", "absolute") // Set position to absolute
                .style("background-color", "white")
                .style("border-width", "2px")
                .style("padding", "5px")
                .style("font-size", "12px")
                .style("pointer-events", "none"); // Make sure tooltip doesn't block mouse events


            var mouseover = function (event, d) {
                tooltip.style("opacity", 1);
            };

            var mousemove = function (event, d) {
                console.log(event.pageX)
                console.log(event.pageY)
                tooltip
                    .html("Ozone value: " + d.Ozone)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 20) + "px");
            };

            var mouseleave = function (d) {
                tooltip.style("opacity", 0);
            };

            container_g.selectAll()
                .data(data)
                .enter()
                .append('rect')
                .attr('x', function (d) {
                    return xScale(d.Month);
                })
                .attr('y', function (d) {
                    return yScale(d.Zone);
                })
                .attr('width', xScale.bandwidth())
                .attr('height', yScale.bandwidth())
                .style('fill', function (d) {
                    return heatmapColor(d.Ozone);
                })
                .attr('class', 'heatmap-rect')
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)

        });

//     </script>
// </body>

// </html>