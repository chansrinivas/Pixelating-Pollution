// <!-- <!DOCTYPE html>
// <meta charset="utf-8">

// <script src="https://d3js.org/d3.v6.js"></script>

// <div id="linechart-container"></div>

// <script> -->

const m = { top: 90, right: 100, bottom: 30, left: 100 },
    w = 1000 - 200,
    h = 600 - 200;

const s = d3.select("#linechart-container")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 600)
    .append("g")
    .attr("transform", `translate(${m.left},${m.top})`);

d3.csv("https://gist.githubusercontent.com/chansrinivas/ccc6f0942556912314cd3646fea1b356/raw/cc1d9d8fcaa494dd5ba4fd815ab968fe5c9c8267/interactive-line.html").then(function (data) {

    const allGroup = ["Y-2013", "Y-2014", "Y-2015", "Y-2016", "Y-2017", "Y-2018", "Y-2019", "Y-2020", "Y-2021", "Y-2022", "Y-2023", "Avg-10-year"]

    const dataReady = allGroup.map(function (grpName) { 
        return {
            name: grpName,
            values: data.map(function (d) {
                return { time: d.time, value: +d[grpName] };
            })
        };
    });


    const customColors = ['#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#F2BC0B', 'red'];

    const myCustomColorScale = d3.scaleOrdinal()
        .domain(allGroup)
        .range(customColors);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
        .domain([1, 12])
        .range([0, w]);
    s.append("g")
        .attr("transform", `translate(0, ${h})`)
        .call(d3.axisBottom(x));

    // Add X axis label
    s.append("text")
        .attr("transform", `translate(${w / 2}, ${h + m.top - 40})`)
        .style("text-anchor", "middle")
        .text("Month");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([30, 220])
        .range([h, 0]);
    s.append("g")
        .call(d3.axisLeft(y));

    // Add Y axis label
    s.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -70)
        .attr("x", -h / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Air Quality Index");

    const line = d3.line()
        .x(d => x(+d.time))
        .y(d => y(+d.value))
        .defined(d => !isNaN(d.value));

        s.selectAll("myLines")
        .data(dataReady)
        .join("path")
        .attr("class", d => d.name)
        .attr("d", d => line(d.values))
        .attr("stroke", d => d.name === "Avg-10-year" ? "red" : myCustomColorScale(d.name))
        .attr("stroke-dasharray", d => d.name === "Avg-10-year" ? "5,5" : "none")
        .style("stroke-width", d => (d.name === "Y-2023" || d.name === "Avg-10-year") ? 4.0 : 3.0)
        .style("fill", "none")
        .each(function(d) {
            d.originalStroke = d3.select(this).attr("stroke"); // Store the original stroke color
        })
        .on('mouseover', function (event, d) {
            d3.select(this)
            .attr('r', 6)
            .attr("stroke", "#33D259");
            s.append('text')
                .attr('id', 'tooltip')
                .attr('transform', 'translate(400,1)')
              
                .attr('font-size', '13px')
                .attr('font-weight', 'bold')
                .attr('fill', 'black')
                .text('Year: ' + d.name); 
        })
        .on('mouseout', function (event, d) {
            d3.select(this)
                .attr('stroke', d.originalStroke); // Revert stroke color to original on mouseout
            hideTooltip();
        });
    


    s.selectAll("myDots")
        .data(dataReady)
        .join('g')
        .style("fill", d => myCustomColorScale(d.name))
        .attr("class", d => d.name)
        .selectAll("myPoints")
        .data(d => d.values)
        .join("circle")
        .attr("cx", d => x(d.time))
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("stroke", "white")
        .on('mouseover', function (event, d) {
            d3.select(this)
            .attr('r', 6)
                .text(d.value)

            showTooltip(event, d);
        })
        .on('mouseout', function (event, d) {
            d3.select(this).attr('r', 4);
            hideTooltip();
        })

    const legend = s
        .selectAll("myLegend")
        .data(dataReady)
        .join('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(${30 + i * 60}, -40)`);

    legend.append("rect")
        .attr("x", 35)
        .attr("y", -30)
        .attr("width", 30)
        .attr("height", 8)
        .style("fill", d => myCustomColorScale(d.name));

    legend.append("text")
        .attr('x', 25)
        .text(d => d.name)
        .style("fill", "black")
        .style("font-size", 14)
        .on("click", function (event, d) {
            currentOpacity = d3.selectAll("." + d.name).style("opacity")
            d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0 : 1)
        })

    function showTooltip(event, d) {

        var tooltip = s.append('g')
            .attr('id', 'tooltip')
            .attr('transform', 'translate(' + (x(d.time) + 25) + ',' + (y(d.value) - 10) + ')');

        tooltip.append('text')
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .attr('fill', 'black')
            .text('AQI: ' + d.value);
        console.log(d)


        tooltip.append('text')
            .attr('dy', '1.2em')
            .attr('font-size', '13px')
            .attr('fill', 'black')
            .text('Month: ' + d.time);
    }


    function hideTooltip() {
        d3.select('#tooltip').remove();
    }
})
// </script>