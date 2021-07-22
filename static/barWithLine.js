// console.clear()

function renderBarAndLineChart(div_id, data) {
    // set the dimensions and margins of the graph


    var renderDiv = document.getElementById(div_id)
    renderDiv.innerHTML = ""
    var div_width = renderDiv.offsetWidth;
    var div_height = renderDiv.offsetHeight;
    var margin = { top: 20, right: 40, bottom: 30, left: 50 },
        width = div_width - margin.left - margin.right,
        height = div_height - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");

    // set the ranges
    var xBar = d3.scaleBand().range([0, width]).paddingInner(0.5).paddingOuter(0.25);
    var xLine = d3.scalePoint().range([0, width]).padding(0.5);
    var yBar = d3.scaleLinear().range([height, 0]);
    var yLine = d3.scaleLinear().range([height, 0]);

    // define the 2nd line
    var valueline2 = d3.line()
        .x(function (d) { return xLine(d.year); })
        .y(function (d) { return yLine(d.count); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(renderDiv).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");



    console.table(data);

    // Scale the range of the data
    xBar.domain(data.map(function (d) { return d.year; }));
    xLine.domain(data.map(function (d) { return d.year; }));
    yBar.domain([0, d3.max(data, function (d) { return d.laws; })]);
    yLine.domain([0, d3.max(data, function (d) { return Math.max(d.count); })])


    var rect = svg.selectAll("rect")
        .data(data)

    rect.enter().append("rect")
        .merge(rect)
        .attr("class", "bar")
        .style("stroke", "none")
        .style("fill", "steelblue")
        .attr("x", function (d) { return xBar(d.year); })
        .attr("width", function (d) { return xBar.bandwidth(); })
        .attr("y", function (d) { console.log(); return yBar(d.laws); })
        .attr("height", function (d) { console.log('value: ', yBar(d.laws)); return height - yBar(d.laws); })

    var text = svg.selectAll("text")
        .data(data)

    text.enter().append("text")
        .merge(text)

        .attr("x", function (d) { return xBar(d.year); })

        .attr("y", function (d) { console.log(); return yBar(d.laws); })

        .attr("width", function (d) { return xBar.bandwidth() / 2; })
        .text(function (d) { return d.laws; });;

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "crimson")
        .attr("d", valueline2);

    var points2 = svg.selectAll("circle.point2")
        .data(data)

    points2.enter().append("circle")
        .merge(points2)
        .attr("class", "point2")
        .style("stroke", "crimson")
        // .style("stroke-width", 3)
        .style("fill", "crimson")
        .attr("cx", function (d) { return xLine(d.year); })
        .attr("cy", function (d) { return yLine(d.count); })
        .attr("r", function (d) { return 5; });


    text.enter().append("text")
        .merge(text)

        .attr("x", function (d) { return xLine(d.year) - 10; })

        .attr("y", function (d) { console.log(); return yLine(d.count) - 9; })

        // .attr("width", function (d) { return xBar.bandwidth() / 2; })
        .text(function (d) { return d.count; });;

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xBar));

    // Add the Y0 Axis
    svg.append("g")
        .attr("class", "axisSteelBlue")
        .call(d3.axisLeft(yBar));

    // Add the Y1 Axis
    svg.append("g")
        .attr("class", "axisRed")
        .attr("transform", "translate( " + width + ", 0 )")
        .call(d3.axisRight(yLine));

    pageComponents["barwithlinechart"] = {
        id: div_id,
        el: renderDiv,
        selection: undefined
    }
    // });
}

var laws_data = [
    {
        "year": 2014,
        "laws": 106,
        "count": 1.2
    },
    {
        "year": 2015,
        "laws": 113,
        "count": 2.14
    },
    {
        "year": 2016,
        "laws": 119,
        "count": 3.2
    },
    {
        "year": 2017,
        "laws": 120,
        "count": 4.1
    },
    {
        "year": 2018,
        "laws": 100,
        "count": 5.17
    }
]

renderBarAndLineChart("div_lawschart", laws_data)