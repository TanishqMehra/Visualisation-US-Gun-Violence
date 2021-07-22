
function displaySimpleDate(index) {
    // console.log(index)
    var m_y = rangeSliderList[index].split(' ')
    // console.log(m_y[0] + "'" + m_y[1].split("20")[1])
    return m_y[1]+ "-"+ monthMap[m_y[0]] 
}


$(".range-slider.monthyear").ionRangeSlider({
    // skin: "sharp",
    type: "double",
    grid: true,
    grid_num: 5,
    // grid_snap: true,
    force_edges: true,
    values: rangeSliderList,
    from: rangeSliderList[0],
    to: rangeSliderList[rangeSliderList - 1],
    // min: dateToTS(new Date(2014, 0, 1)),
    // max: dateToTS(new Date(2018, 2, 31)),
    // grid_num:10,
    // drag_interval: true,
    onFinish: function (selection) {
        // setTimeout(function () {
            var selectionRange = [selection.from_pretty, selection.to_pretty]
            updateTimePeriod(selectionRange)
        // }, 500)
    },
    // from: dateToTS(new Date(year, 10, 8)),
    // to: dateToTS(new Date(year, 10, 23)),
    prettify: displaySimpleDate
});


