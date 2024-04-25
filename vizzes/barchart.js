// <!-- <!DOCTYPE html>
// <meta charset="utf-8">


// <script src="https://d3js.org/d3.v6.js"></script>

// <div id="my_dataviz"></div>

// <script> -->
// var container = d3.select('#d3-viz-container');

// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 70, left: 50 },
    width = 860 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#d3-viz-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("https://gist.githubusercontent.com/chansrinivas/3a8ebf18a807d920891110528f58b463/raw/346321afbf500adde192b9bac96fcc32ed952c00/barchart-bayarea.csv").then(function (data) {

    // List of subgroups = header of the csv files = soil condition here
    const subgroups = data.columns.slice(1);

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map(d => d.date);

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 150])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Daily AQI for PM 2.5 Value");

    // Calculate the width of each group
    const barWidth = x.bandwidth();

    // Another scale for subgroup position
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, barWidth])
        .padding([0.05]);

    // color palette = one color per subgroup
    // color palette = shades of green
    // Define the base color
    const baseColor = d3.rgb(25, 123, 57);

    // Define the range of shades
    const shadesRange = d3.range(0, 1, 1 / subgroups.length).map(t => baseColor.brighter(t * 3));

    // Color scale = shades of the provided color
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(shadesRange);



    // Show the bars
    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x(d.date)}, 0)`) // Adjust x-position based on date
        .selectAll("rect")
        .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
        .join("rect")
        .attr("x", d => xSubgroup(d.key)) // Adjust x-position based on subgroup
        .attr("y", d => y(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key));

    // Add legend
    const legendLabels = ["San Francisco", "San Jose", "Oakland", "Fremont"];

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 100},${margin.top})`); // Adjust position for vertical legend

    legendLabels.forEach((label, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`); // Adjust position for vertical legend

        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", color(subgroups[i]));

        legendRow.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .attr("dy", ".35em")
            .text(label);
    });
})

// <!-- </script> -->
