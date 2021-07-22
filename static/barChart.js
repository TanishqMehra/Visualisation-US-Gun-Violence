function renderBarChart(render_id, render_data) {

    // d3.selectAll("svg").remove();

    var renderDiv = document.getElementById(render_id)
    renderDiv.innerHTML = ""

    var height = renderDiv.offsetHeight,
        width = renderDiv.offsetWidth


    var svg = d3.select("#" + render_id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    inner_padding = 125,
        width = svg.attr("width") - inner_padding,
        height = svg.attr("height") - 80;


    var x_scale = d3.scaleLinear().range([0, width]),
        y_scale = d3.scaleBand().range([0, height]).padding(0.4)

    var g = svg.append("g")
        .attr("transform", "translate(" + inner_padding / 2 + "," + inner_padding / 2 + ")");

    // svg.append("text")
    //     .attr("x", width * 3 / 4)
    //     .attr("y", 30)
    //     .style("font-size", "30px")
    //     .attr("class", "title")
    //     .text("Bar Chart For " + field);

    //if data available
    // console.log(data_count);

    x_scale.domain([0, d3.max(render_data, function (d) { return d.value; })]);
    y_scale.domain(render_data.map(function (d) { return d.key; }));

    var svg_x_scale = g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_scale).tickFormat(function (d) { // Try with X Scaling too.
            return d;
        })
            .ticks(10));

    var svg_y_scale = g.append("g") //Another group element to have our y-axis grouped under one group element
        .call(d3.axisLeft(y_scale))


    // svg_x_scale.selectAll("text")
    //     .attr("transform", "translate(-10,0)rotate(-45)")
    //     .style("text-anchor", "end");

    // svg_x_scale.append("text")
    //     .attr("y", 60)
    //     .attr("x", width / 2)
    //     .attr("text-anchor", "end")
    //     .attr("class", "x label")
    //     .attr("stroke", "black")
    //     .style("font-size", "15px")
    //     .text(field);

    //We have also specified the number of ticks we would like our y-axis to have using ticks(10).
    // svg_y_scale.append("text")
    //     .attr("y", 20)
    //     .attr("x", -height / 2)
    //     .attr("transform", "rotate(-90)")
    //     .attr("dy", "-5.1em")
    //     .attr("class", "y label")
    //     .attr("text-anchor", "end")
    //     .attr("stroke", "black")
    //     .style("font-size", "15px")
    //     .text("Total Players");

    // var tip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([-10, 0])
    //     .html(function (d) {
    //         return "<span style='color:red'>" + d.value + "</span>";
    //     });

    // svg.call(tip);

    g.selectAll(".bar") //created dynamic bars with our data using the SVG rectangle element.
        .data(render_data)
        .enter().append("rect")
        .attr("class", "bar")
        .transition()
        .duration(500)
        .attr("y", function (d) { return y_scale(d.key); })  //x scale created earlier and pass the year value from our data.
        .attr("x", /*function (d) { return x_scale(d.value); }*/0) // pass the data value to our y scale and receive the corresponding y value from the y range.
        .attr("height", y_scale.bandwidth()) //width of our bars would be determined by the scaleBand() function.
        .attr("width", function (d) { return x_scale(d.value); })
        .attr('fill', "#c5487b")
        .attr('font')
    // .on("click", function(){
    // selectBar(this)
    // });
    // .on('mouseover', tip.show)
    // .on('mouseout', tip.hide); //height of the bar would be calculated as height - yScale(d.value)
    //the height of the SVG minus the corresponding y-value of the bar from the y-scale
    // });

    function selectBar(event_bar) {

    }

    function deselectAllBar(clearing_element) {

    }

    pageComponents["barchart"] = {
        id: render_id,
        el: renderDiv,
        selection: undefined
    }

}




data = [
    {
        "key": "Chicago",
        "value": 17556
    },
    {
        "key": "San Jose",
        "value": 16306
    },
    {
        "key": "Tulsa",
        "value": 15029
    },
    {
        "key": "Washington",
        "value": 13577
    },
    {
        "key": "Detroit",
        "value": 10244
    },
    {
        "key": "Bakersfield",
        "value": 9712
    },
    {
        "key": "Atlanta",
        "value": 8929
    },
    {
        "key": "Charlotte",
        "value": 8925
    },
    {
        "key": "Hartford",
        "value": 8739
    },
    {
        "key": "Dallas",
        "value": 8103
    },
    {
        "key": "Philadelphia",
        "value": 7626
    },
    {
        "key": "Oakland",
        "value": 6939
    }
]
renderBarChart("div_barchart", data)