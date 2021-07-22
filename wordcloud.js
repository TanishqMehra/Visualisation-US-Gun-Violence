
function renderWordCloud(render_id, myWords) {
    var fill = d3.scaleOrdinal(d3.schemeCategory10);
    // List of words

    var render_div = document.getElementById(render_id)
    var div_width = render_div.offsetWidth;
    var div_height = render_div.offsetHeight;
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = div_width - margin.left - margin.right,
        height = div_height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(render_div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) { return { text: d.gun, count: d.count }; }))
        .padding(5)        //space between words
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .fontSize(function (d) { return d.count; })      // font count of words
        .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.count * 0.60; })
            // .style("fill", "#69b3a2")
            .style("fill", function (d, i) { return fill(i); })

            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
    pageComponents["wordcloud"] = {
        id: render_id,
        el: render_div,
        selection: undefined
    }

}
var data = [{ gun: "AK-47", count: "10" }, { gun: "Shotgun", count: "20" }, { gun: "Rifle", count: "50" }, { gun: "Pistol", count: "30" }, { gun: "Handgun", count: "20" }, { gun: "7mmGun", count: "60" }]

renderWordCloud("div_wordcloud", data)