function renderLineGraph(render_id, render_data) {
    var parseTime = d3.timeParse("%Y");

    document.getElementById(render_id).innerHTML = ""

    var div_width = document.querySelector("#" + render_id).offsetWidth;
    var div_height = document.querySelector("#" + render_id).offsetHeight;

    var svg = d3.select("#" + render_id)
        .append("svg")
        .attr("width", div_width)
        .attr("height", div_height);

    inner_padding = 50,
        width = svg.attr("width") - inner_padding,
        height = svg.attr("height") - inner_padding;

    var g = svg.append("g")
        .attr("transform", "translate(" + inner_padding / 2 + "," + inner_padding / 2 + ")");

    var data = render_data;
    data.columns = ["year", "n_incidents", "lawtotal"]

    data.forEach(d => {
        // d.year = parseTime(d.year);
        d.year = JSON.stringify(moment.utc(d.year).year())
        // for (var k in d) if (k !== "year") d[k] = +d[k];
    });

    console.log(data)

    var series = data.columns.slice(1).map(function (key) {
        return data.map(function (d) {
            return {
                key: key,
                year: d.year,
                value: d[key]
            };
        });
    });
    console.log(series)


    var x = d3.scaleTime()
        .domain([data[0].year, data[data.length - 1].year])
        .range([0, width]);

    var y = {}
    series.forEach(function (d, i) {
        console.log(i)
        var start_ = height - i * height / series.length;
        y[d[0].key] = d3.scaleLinear()
            .domain([d3.min(d, function (s) { return s.value; }), d3.max(d, function (s) { return s.value; })])
            .range([start_, start_ - height / series.length]);
        // console.log(maxi_);
    })


    var z = d3.scaleOrdinal(d3.schemeCategory10);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var serie = g.selectAll(".serie")
        .data(series)
        .enter().append("g")
        .attr("class", "serie");

    serie.append("path")
        .attr("class", "line")
        .style("stroke", function (d) { return z(d[0].key); })
        .attr("d", d3.line()
            .x(function (d) { return x(d.year); })
            .y(function (d) { return y[d.key](d.value); }));

    var label = serie.selectAll(".label")
        .data(function (d) { return d; })
        .enter().append("g")
        .attr("class", "label")
        .attr("transform", function (d, i) { return "translate(" + x(d.year) + "," + y[d.key](d.value) + ")"; });


    var fieldMapping = {
        "n_incidents": "Incidents",
        "lawtotal": "Total Laws"
    }
    label.append("text")
        // .attr("dy", ".5em")
        // .attr("dx", ".5em")
        .style("text-anchor", 'middle')
        .style('alignment-baseline', 'central')
        .text(function (d) { return d.value; })
        .filter(function (d, i) { return i === data.length - 1; })
        .style('text-anchor', 'start')
        .attr("dx", "-0.75em")
        .append("tspan")
        .attr("class", "label-key")
        .style('font-weight', 'bold')
        .text(function (d) { return " " + fieldMapping[d.key]; });

    // labelPadding = 10
    // label.append("rect", "text")
    //     .datum(function () { return this.getBBox(); })
    //     .attr("x", function (d) { return d.x - labelPadding; })
    //     .attr("y", function (d) { return d.y - labelPadding; })
    //     .style("fill",'white')
    //     .attr("width", function (d) { return d.width + 2 * labelPadding; })
    //     .attr("height", function (d) { return d.height + 2 * labelPadding; });
}

var render_data = [
    {
        "year": "2013-01-01T05:00:00.000Z",
        "n_incidents": 39,
        "lawtotal": 99
    },
    {
        "year": "2014-01-01T05:00:00.000Z",
        "n_incidents": 3732,
        "lawtotal": 100
    },
    {
        "year": "2015-01-01T05:00:00.000Z",
        "n_incidents": 3234,
        "lawtotal": 102
    },
    {
        "year": "2016-01-01T05:00:00.000Z",
        "n_incidents": 3617,
        "lawtotal": 104
    },
    {
        "year": "2017-01-01T05:00:00.000Z",
        "n_incidents": 4588,
        "lawtotal": 106
    },
    {
        "year": "2018-01-01T05:00:00.000Z",
        "n_incidents": 1096,
        "lawtotal": 109
    }
]

renderLineGraph("div_linegraph", render_data)