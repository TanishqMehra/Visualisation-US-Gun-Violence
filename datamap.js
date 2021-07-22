

function renderDatamap(data, field) {
    var processedData, onlyValues, minValue, maxValue,
        dataset = {}, datamapSelection = undefined,
        selectionColor = "#a1dbff";


    // d3.csv("../data/us-state-firearm-laws.csv", function (data) {
    processedData = data.map(record => {
        if (record.year == "2018") {
            return {
                state: findStateCode[record.state] || record.state,
                value: record[field]
            }
        }
    })
    // console.log(processedData)
    processedData = processedData.filter(record => record != undefined)
    onlyValues = processedData.map(record => {
        return record.value
    })
    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);
    var paletteScale = d3.scale.linear()
        .domain([minValue, maxValue])
        // .range(["#EFEFFF", "#02386F"]);
        .range(["#F6BDC0", "#DC1C13"])


    processedData.forEach(function (item) {
        dataset[item.state] = { numberOfThings: parseInt(item.value), fillColor: paletteScale(item.value) };
    });

    map = new Datamap({
        element: document.getElementById('div_datamap'),
        scope: 'usa',
        responsive: true,
        data: dataset,
        fills: {
            defaultFill: {
                // 'CA': "black"
            }
        },
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // highlightFillColor: function (geo) {
            //     return geo['fillColor'] || '#F5F5F5';
            // },
            highlightFillColor: function (geo) {
                return selectionColor
            },
            highlightBorderColor: '#B7B7B7',
            popupTemplate: function (geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return; }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>' + fieldMapping[field] + ': <strong>', data.numberOfThings, '</strong>',
                    '</div>'].join('');
            }
        },
        done: function (datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
                // debugger;
                // alert(geography.properties.name);
                // map.updateChoropleth({ [geography.id]: 'green' }, { reset: true })
                console.log("Click on Datamap state: ", findStateName[geography.id])
                clearDatamapSelection(datamap)
                setDatamapSelection(datamap, geography)
            });
        }
    })
    map.labels()
    map.legend()

    // window.addEventListener('resize', function() {
    //     map.resize();
    // });
    // })

    function setDatamapSelection(datamap, geography) {
        // debugger;
        var stateCode = geography.id,
            originalFillColor = datamap.options.data[stateCode]["fillColor"]
        datamapSelection = {
            stateCode: stateCode,
            originalFillColor: originalFillColor
        }
        datamap.updateChoropleth({ [geography.id]: selectionColor })

        // map.updateChoropleth({ [geography.id]: "green" })
    }

    function clearDatamapSelection(datamap) {
        if (datamapSelection) {
            datamap.updateChoropleth({ [datamapSelection.stateCode]: datamapSelection.originalFillColor })
            datamapSelection = undefined
        }
    }

}

// d3.csv("../data/us-state-firearm-laws.csv", function (data) {
//     renderDatamap(data, "lawtotal")
// })

d3.csv("../data/gun-violence-laws-perstate.csv", function (data) {
    renderDatamap(data, "lawtotal")
})