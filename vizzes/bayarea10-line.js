// <!-- <!doctype html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Multi Line chart</title>
//     <script src="https://d3js.org/d3.v7.min.js"></script>
//     <script src="https://colorbrewer2.org/export/colorbrewer.js"></script>
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>
// </head>

// <body>
//     <script> -->

document.addEventListener("DOMContentLoaded", function() {
var canvasWidth = 1000;
var canvasHeight = 600;
var m = 200;

var container = d3.select('#linechart-container');

var s = container
    .append('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);

var w = canvasWidth - m;
var h = canvasHeight - m;

s
    .append('text')
    .attr('transform', 'translate(355,530)')
    .attr('x', 0)
    .attr('y', 50)
    .attr('font-size', '24px')
    .text('Bay Area Quality over the past 10 years');

var xScale = d3.scaleLinear()
    .domain([1, 12])
    .range([0, w]);
var yScale = d3.scaleLinear()
    .domain([0, 200])
    .range([h, 0]);


var container_g = s
    .append('g')
    .attr(
        'transform',
        'translate(' + 100 + ',' + 100 + ')',
    );

var monthMap = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
};

d3.csv(
    'https://gist.githubusercontent.com/chansrinivas/73e91e1b5539720f4ce555aad77aa212/raw/ed7c36c871db25cbbfefd4d8c9afc4ad499beb73/bayarea-linechart.csv',
).then((data) => {
    data.forEach((d) => {
        d.Month = monthMap[d.Month]; // Convert month name to number
        for (var country in d) {
            if (country !== 'Month' && d.hasOwnProperty(country)) {
                d[country] = +d[country];
            }
        }
    });

    var allValues = data.columns
        .slice(1)
        .map((country) => data.map((d) => d[country]))
        .flat();
    yScale.domain([
        d3.min(allValues),
        d3.max(allValues),
    ]);


    container_g.selectAll('.line')
        .data(data.columns.slice(1))
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', (d, i) => {
            if (d === '2023') return '#F2BC0B';
            else if (d === '10-year-average') return 'red';
            else return '#d9d9d9'; 
        })
        .attr('stroke-width', (d) => {
            if (d === '2023' || d === '10-year-average') return 2.8;
            else return 1.8; 
        })
        .attr('stroke-dasharray', (d) => {
            if (d === '10-year-average') return '4,4'; 
            else return 'none'; 
        })
        .attr('d', (country) =>
            d3.line()
                .x((d) => xScale(d.Month))
                .y((d) => yScale(d[country]))(data),
        );


    container_g.selectAll('.circle-group')
        .data(data.columns.slice(1))
        .enter()
        .append('g')
        .attr('class', 'circle-group')
        .each(function (country, i) {
            d3.select(this)
                .selectAll('.circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'circle')
                .attr('cx', (d) => xScale(d.Month))
                .attr('cy', (d) => yScale(d[country]))
                .attr('r', (d) => {
                    if (country === '2023' || country === '10-year-average') return 4; 
                    else return 3; 
                })
                .style('fill', (d) => {
                    if (country === '2023') return '#F2BC0B';
                    else if (country === '10-year-average') return 'red';
                    else return '#d9d9d9';
                })
                .style('opacity', 1)
                .on('mouseover', function (event, d) {
                    d3.select(this).attr('r', 6);
                    showTooltip(d);
                })
                .on('mouseout', function (event, d) {
                    d3.select(this).attr('r', 3);
                    hideTooltip();
                });

            function showTooltip(d) {
                var tooltip = container_g.append('g')
                    .attr('id', 'tooltip')
                    .attr('transform', 'translate(' + (xScale(d.Month) + 45) + ',' + (yScale(d[country]) + 40) + ')');

                tooltip.append('text')
                    .attr('font-size', '12px')
                    .attr('font-weight', 'bold')
                    .attr('fill', 'black')
                    .text('AQI: ' + d[country]);

                tooltip.append('text')
                    .attr('dy', '1.2em') 
                    .attr('font-size', '12px')
                    .attr('fill', 'black')
                    .text('Month: ' + d.Month);
            }

            function hideTooltip() {
                d3.select('#tooltip').remove();
            }
        });


    container_g
        .append('g')
        .attr('transform', 'translate(0, ' + h + ')')
        .call(
            d3
                .axisBottom(xScale)
                .tickValues(data.map((d) => d.Month))
                .tickFormat(d3.format('d')),
        )
        .append('text')
        .attr('y', h - 255)
        .attr('x', w - 350)
        .attr('font-family', 'sans-serif')
        .attr('font-size', '13px')
        .attr('fill', 'black')
        .text('Month');

    container_g
        .append('g')
        .call(
            d3
                .axisLeft(yScale)
                .tickFormat(function (d) {
                    return d;
                })
                .ticks(12),
        )
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 10)
        .attr('x', -100)
        .attr('dy', '-5.1em')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '13px')
        .attr('fill', 'black')
        .text('Air Quality Index');

    var legend = s.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(130,20)')
        .attr('font-size', '12px')
        .call(d3.legendColor()
            .shape('rect')
            .shapeWidth(30)
            .shapeHeight(8)
            .shapePadding(35)
            .orient('horizontal')
            .scale(d3.scaleOrdinal()
                .domain(data.columns.slice(1))
                .range(['#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#d9d9d9', '#F2BC0B', 'red'])
            )
        );


    container_g.selectAll('.line')
        .on('click', function (event, d) {
            var clickedLine = d3.select(this);
            var isActive = clickedLine.classed('active');

            container_g.selectAll('.line').classed('active', false).attr('stroke', (d, i) => {
                if (d === '2023') return '#F2BC0B';
                else if (d === '10-year-average') return 'red';
                else return '#d9d9d9';
            });

            if (!isActive) {
                clickedLine.classed('active', true).attr('stroke', 'blue');
            } else {
                clickedLine.classed('active', false).attr('stroke', (d, i) => {
                    if (d === '2023') return '#F2BC0B';
                    else if (d === '10-year-average') return 'red';
                    else return '#d9d9d9';
                });
            }
        });

});
});
//     <!-- </script>
// </body>

// </html> -->