const margin = { top: 10, right: 30, bottom: 70, left: 50 },
    width = 860 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("#d3-viz-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("https://gist.githubusercontent.com/chansrinivas/3a8ebf18a807d920891110528f58b463/raw/346321afbf500adde192b9bac96fcc32ed952c00/barchart-bayarea.csv").then(function (data) {

    const subgroups = data.columns.slice(1);

    const groups = data.map(d => d.date);

    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));

    const y = d3.scaleLinear()
        .domain([0, 150])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Daily AQI for PM 2.5 Value");

    const barWidth = x.bandwidth();

    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, barWidth])
        .padding([0.05]);

    const baseColor = d3.rgb(25, 123, 57);

    const shadesRange = d3.range(0, 1, 1 / subgroups.length).map(t => baseColor.brighter(t * 3));

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(shadesRange);

    const tooltip = d3.select("#d3-viz-container")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x(d.date)}, 0)`) 
        .selectAll("rect")
        .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
        .join("rect")
        .attr("x", d => xSubgroup(d.key)) 
        .attr("y", d => y(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key))
        .attr("class", d => `bar ${d.key}`) 
      
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`<strong>${d.key}</strong>: ${d.value}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).attr('opacity', 0.8).attr('fill', 'red');
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr('opacity', 1).attr('fill', d => color(d.key));
        });
        

    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x(d.date)}, 0)`)
        .selectAll("text")
        .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
        .join("text")
        .attr("x", d => xSubgroup(d.key) + xSubgroup.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(d => d.value);


    function update() {
        d3.selectAll(".checkbox").each(function (d) {
            var cb = d3.select(this);
            var grp = cb.property("value");
            console.log(grp)

            if (cb.property("checked")) {
                svg.selectAll("rect[value='" + grp + "']")
                    .transition()
                    .duration(1000)
                    .style("opacity", 1)
                    .attr("fill", "red");
            } else {
                svg.selectAll("rect[value='" + grp + "']")
                    .transition()
                    .duration(1000)
                    .style("opacity", 0);
            }

        });
    }

    d3.selectAll(".checkbox").on("change", update);
    update()

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

});