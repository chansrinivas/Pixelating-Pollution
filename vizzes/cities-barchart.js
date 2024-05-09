const margin = { top: 10, right: 30, bottom: 70, left: 50 },
    width = 860 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const tooltip = d3.select("#d3-viz-container")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const svg = d3.select("#d3-viz-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("https://gist.githubusercontent.com/chansrinivas/3a8ebf18a807d920891110528f58b463/raw/eb7c3b89d6fb311ad6e127e899494ee783c0fa1d/barchart-bayarea.csv").then(function (data) {

    const subgroups = data.columns.slice(1);
    const groups = data.map(d => d.date);

    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll(".tick text") 
            .style("font-size", "12px"); 

    const y = d3.scaleLinear()
        .domain([0, 160])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll(".tick text") // Increase font size of y-axis ticks
            .style("font-size", "12px"); // Adjust the font size as needed

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -5 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Daily AQI for PM 2.5 Value");

    const barWidth = x.bandwidth();

    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, barWidth])
        .padding([0.05]);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#ffff99', '#fdc086','#beaed4', '#7fc97f']);

    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x(d.date)}, 0)`)
        .selectAll("rect")
        .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
        .join("rect")
        .attr("class", d => d.key)
        .attr("x", d => xSubgroup(d.key))
        .attr("y", d => y(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key))
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`<strong>${d.key}</strong>: ${d.value}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");

        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr('opacity', 1).attr('fill', d => color(d.key));
        });

        svg.append("line")
        .attr("x1", 30) 
        .attr("y1", 10) 
        .attr("x2", 250 + 80) 
        .attr("y2", 10)
        .style("stroke", "black")
        .style("stroke-width", 1); 


        svg.append("line")
        .attr("x1", 30) 
        .attr("y1", 10) 
        .attr("x2", 30) 
        .attr("y2", 35) 
        .style("stroke", "black")
        .style("stroke-width", 1); 

        svg.append("line")
        .attr("x1", 330) 
        .attr("y1", 10)
        .attr("x2", 330) 
        .attr("y2", 35) 
        .style("stroke", "black") 
        .style("stroke-width", 1); 

        svg.append("text")
        .attr("x", 180)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Huge jump in Daily AQI value in less than 48 hours");


    const legendLabels = ["San Francisco", "San Jose", "Oakland", "Fremont"];

    const legend = svg.append("g")
        .attr("transform", `translate(${width - 100},${margin.top})`);

    legendLabels.forEach((label, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

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

    function update() {
        d3.selectAll(".container input[type='checkbox']").each(function () {
            const cb = d3.select(this);
            const grp = cb.property("value");
            console.log("Checkbox:", grp, "Checked:", cb.property("checked"));

            svg.selectAll(`.${grp}`)
                .transition()
                .duration(1000)
                .style("opacity", cb.property("checked") ? 1 : 0);
        });
    }


    d3.selectAll(".container input[type='checkbox']").on("change", update);

    update()
})
