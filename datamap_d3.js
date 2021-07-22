//Width and height of map

// var datamapSelection;
var selectionColor = "#a1dbff";
// datamapClearSelectionEvent = new Event('datamapClear')
function renderDatamap(div_id, data) {


    var renderDiv = document.getElementById(div_id)
    var width = renderDiv.offsetWidth;
    var height = renderDiv.offsetHeight;
    // var height = 250
    // var datamapSelection;

    var lowColor = '#f9f9f9'
    var highColor = '#bc2a66'

    // D3 Projection
    var projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2]) // translate to center of screen
        .scale([600]); // scale things down so see entire US

    // Define path generator
    var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
        .projection(projection); // tell path generator to use albersUsa projection


    // var tip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([-5, 0])
    //     .html(function (d) {
    //         debugger;
    //         var dataRow = countryById.get(d.properties.name);
    //         if (dataRow) {
    //             console.log(dataRow);
    //             return dataRow.states + ": " + dataRow.mortality;
    //         } else {
    //             console.log("no dataRow", d);
    //             return d.properties.name + ": No data.";
    //         }
    //     })
    //Create SVG element and append map to the SVG
    var svg = d3.select(renderDiv)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // renderDiv.addEventListener('datamapSelectionChange', onDatamapSelectionChange)
    // Load in my states data!
    // d3.csv("../data/gun-violence-laws-perstate.csv", function (data) {
    var dataArray = [];

    console.log(data)
    data = data.map(record => {
        if (record.year == "2018") {
            return {
                state: findStateName[record.state] || record.state,
                value: record["n_killed"]
            }
        }
    })

    data = data.filter(record => record != undefined)
    mainData = data
    for (var d = 0; d < data.length; d++) {
        dataArray.push(parseFloat(data[d].value))
    }
    console.log(data)
    var minVal = d3.min(dataArray)
    var maxVal = d3.max(dataArray)
    var ramp = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor])





    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-2, 0])
        .html(function (d) {
            // debugger;
            var myHtml = ""
            var dataRow = getDataRecordByState(mainData, d.properties.name);
            if (dataRow) {
                // console.log(dataRow);
                // return dataRow.state + ": " + dataRow.value;
                myHtml += "State: <b>" + dataRow.state + "</b><br>Lives Lost: <b>" + dataRow.value + "</b>"
                return myHtml
            } else {
                console.log("no dataRow", d);
                return d.properties.name + ": No data.";
            }
        })


    svg.call(tip);


    // Load GeoJSON data and merge with states data
    d3.json("../data/us-states-map.json", function (json) {
        console.log(json)
        var centroids = json.features.map(function (d) {
            return projection(d3.geoCentroid(d))
        });
        // console.log(centroids);
        centroids = centroids.filter(record => record != null)
        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {

            // Grab State Name
            var dataState = data[i].state;

            // Grab data value 
            var dataValue = data[i].value;

            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {

                    // Copy the data value into the JSON
                    json.features[j].properties.value = dataValue;

                    // Stop looking through the JSON
                    break;
                }
            }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)

            .on('mouseover', tip.show)
            .on('mousedown', setDatamapSelection)
            .on('mouseout', tip.hide)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function (d) { return ramp(d.properties.value) });


        svg.selectAll(".name").data(centroids)
            .enter().append("text")
            .attr("x", function (d) { return d[0]; })
            .attr("y", function (d) { return d[1]; })
            .attr("dy", 5)
            .style("fill", "black")
            .attr("font-size", 8)
            .attr("text-anchor", "middle")
            // .attr("text-color", "yellow")
            .on("mouseover", function () { d3.event.stopPropagation(); })
            .text(function (d, i) { return findStateCode[json.features[i].properties.name] });
        // add a legend
        // var w = 140, h = 300;

        // var key = d3.select(renderDiv)
        //     .append("svg")
        //     .attr("width", w)
        //     .attr("height", h)
        //     .attr("class", "legend");

        // var legend = key.append("defs")
        //     .append("svg:linearGradient")
        //     .attr("id", "gradient")
        //     .attr("x1", "100%")
        //     .attr("y1", "0%")
        //     .attr("x2", "100%")
        //     .attr("y2", "100%")
        //     .attr("spreadMethod", "pad");

        // legend.append("stop")
        //     .attr("offset", "0%")
        //     .attr("stop-color", highColor)
        //     .attr("stop-opacity", 1);

        // legend.append("stop")
        //     .attr("offset", "100%")
        //     .attr("stop-color", lowColor)
        //     .attr("stop-opacity", 1);

        // key.append("rect")
        //     .attr("width", w - 100)
        //     .attr("height", h)
        //     .style("fill", "url(#gradient)")
        //     .attr("transform", "translate(0,10)");

        // var y = d3.scaleLinear()
        //     .range([h, 0])
        //     .domain([minVal, maxVal]);

        // var yAxis = d3.axisRight(y);

        // key.append("g")
        //     .attr("class", "y axis")
        //     .attr("transform", "translate(41,10)")
        //     .call(yAxis)
        pageComponents["datamap"] = {
            id: div_id,
            el: renderDiv,
            selection: undefined
        }
    });
    // });

}

function setDatamapSelection(stateFeatures, node) {
    clearDatamapSelection(true)
    var stateDOM = d3.select(d3.selectAll('path')._groups[0][node])
    pageComponents["datamap"].selection = {
        state: stateFeatures.properties.name,
        node: node,
        originalColor: stateDOM.style('fill')
    }
    stateDOM.style("fill", selectionColor)
    pageComponents["datamap"].el.dispatchEvent(selectionEvent)
}

function clearDatamapSelection(processIncomplete, silent) {
    var datamapSelection = pageComponents["datamap"].selection
    if (datamapSelection) {
        var stateDOM = d3.select(d3.selectAll('path')._groups[0][datamapSelection.node])
        stateDOM.style("fill", datamapSelection.originalColor)
        pageComponents["datamap"].selection = undefined
    }
    if (!processIncomplete && !silent) {
        pageComponents["datamap"].el.dispatchEvent(selectionEvent)
    }

}

function onDatamapSelectionChange() {
    console.log(arguments);
    console.log("Event Fired")
    // Write your code here
}
d3.csv("../data/gun-violence-laws-perstate.csv", function (data) {
    renderDatamap("test_id", data)
})