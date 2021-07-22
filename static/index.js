selectionEvent = new Event('selectionchange');

parameters = {
    timerange: ["from", "to"],
    selection: ,
    value: "CA"/"Chicago",
    mainStatistic: "n_killed"/"n_injured"/"n_guns_involved"/"n_incidents"
    
}
///////////////////////////////////////////////////////

// Time Period

function updateTimePeriod(timeRange){
    console.log(timeRange)
}


////////////////////////////////////////////////////////

// Buttons Component 
buttonsComponent = document.getElementById('buttonsDiv')

buttonsComponent.addEventListener('selectionchange', function(){
    console.log('buttons component selection')
    console.log(pageComponents['buttons'].selection)
})

//////////////////////////////////////////////////////////


//Refresh Button
function onRefreshButtonClick() {
    console.log("Refresh All Selections Button Clicked")
}

function onDatamapClick() {

}

///////////////////////////////////////////////////////////




