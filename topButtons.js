function animateValue($obj, start, end, duration) {
    var range = end - start;
    var current = start;
    var increment = end > start ? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var timer = setInterval(function () {
        current += increment;
        $obj.text(current);
        if (current == end) {
            $obj.text(abbreviateNumber(current)+"+");
            clearInterval(timer);
        }
    }, stepTime);
}

function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "K", "M", "B","T"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

var divClasses = ["total-incidents-counter","lives-lost-counter", "people-injured-counter", "guns-involved-counter"]




function updateNumberStats(totals) {

    divClasses.forEach(divClass => {
        var $number = $("." + divClass),
            start = (totals[divClass] - 100),
            end = (totals[divClass] * 1);
        // debugger;
        animateValue($number, start, end, 100);
    })

}

d3.csv("../data/gun-violence-laws-perstate.csv", function (data) {

    var totals = {
        "lives-lost-counter": 0,
        "people-injured-counter": 0,
        "guns-involved-counter": 0,
        "total-incidents-counter": 2000000
    }

    data.forEach(record => {
        if (record.year == "2018") {
            totals["lives-lost-counter"] += parseInt(record["n_killed"])
            totals["people-injured-counter"] += parseInt(record["n_injured"])
            totals["guns-involved-counter"] += parseInt(record["n_guns_involved"])
            totals["total-laws-counter"] += parseInt(record["lawtotal"])
        }
    })
    updateNumberStats(totals)
})

if (typeof(pageComponents)=="undefined"){
    pageComponents = {}
    pageComponents['buttons']  = {
        id : "buttonsDiv",
        el : document.getElementById('buttonsDiv'),
        children: {
            'incidentsButton' : document.getElementById('incidentsButton'),
            'livesButton' : document.getElementById('livesButton'),
            'injuredButton' : document.getElementById('injuredButton'),
            'gunCountButton' : document.getElementById('gunCountButton')
        },
        selection: 'incidentsButton'
    }

}



function onTopButtonClick(buttonId){
    // console.log("A button is clicked")
    
    var component, buttonDOM, lastSelectedDOM;
    component = pageComponents['buttons']
    buttonDOM = component.children[buttonId] 
    if (buttonDOM.getAttribute('isSelected') != "true") {
       buttonDOM.setAttribute('isSelected', true)
       lastSelectedDOM =  component.children[component.selection]
       lastSelectedDOM.setAttribute('isSelected', false)
       component.selection = buttonId
       component.el.dispatchEvent(selectionEvent)
    }
    // console.log(arguments)
}

