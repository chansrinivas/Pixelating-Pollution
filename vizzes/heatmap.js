var canvasWidth = 1000;
var canvasHeight = 500;
var margin1 = {
    top: 50,
    right: 600,
    bottom: 150,
    left: 190,
};

var svg1 = d3
    .select('#chart-container')
    .append('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);


var width1 = 650;

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
    .interpolator(d3.interpolateRdYlGn)
    .domain([140, 20]);


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


    container_g
        .append('g')
        .attr('transform', 'translate(0, ' + height1 + ')')
        .call(d3.axisBottom(xScale))
        .selectAll("text") 
        .attr("font-size", "14px") 
        .attr('font-family', 'sans-serif')
        .attr("fill", "#140431"); 

    container_g
        .append('g')
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .attr('font-family', 'sans-serif')
        .attr('font-size', '14px')
        .attr('fill', '#140431')

    svg1.append("g")
        .attr("class", "legendSequential")
        .attr("transform", "translate(160,440)");

    var legendSequential = d3.legendColor()
        .title("Ground level Ozone")
        .shapeWidth(137)
        .cells(5)
        .orient("horizontal")
        .scale(heatmapColor);

    svg1.select(".legendSequential")
        .call(legendSequential)
        .selectAll("text")
        .attr("font-size", "13px");

    var tooltip = d3.select("#chart-container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border-width", "2px")
        .style("padding", "5px")
        .style("font-size", "12px")
        .style("pointer-events", "none");


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
