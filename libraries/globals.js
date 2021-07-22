// pageComponents = {}

function getWindowWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getWindowHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

function applyStyle(element, styleObj) {
    for (key in styleObj) {
        element.style[key] = styleObj[key]
    }
}

function adjustLayout(columns, rows) {

    var mygrid,
        colspan, rowspan, childDiv, childDivStyle;

    gridStyle = {
        display: "grid",
        "grid-template-columns": "auto",
        "grid-template-rows": "auto",
        // "grid-gap": "1rem"
    }
    var windowHeight = getWindowHeight(),
        eachDivHeight = windowHeight / rows;
    // debugger;
    for (i = 0; i < columns - 1; i++) {
        gridStyle["grid-template-columns"] += " auto"
    }
    for (i = 0; i < rows - 1; i++) {
        // gridStyle["grid-template-rows"] += eachDivHeight - 5 + "px "
        gridStyle["grid-template-rows"] += " auto"
    }

    mygrid = document.getElementsByClassName("mygrid")[0]
    for (i = 0; i < mygrid.children.length; i++) {
        childDiv = mygrid.children[i]
        childDivStyle = {}
        colspan = childDiv.attributes["colspan"] ? childDiv.attributes["colspan"].value : "1"
        rowspan = childDiv.attributes["rowspan"] ? childDiv.attributes["rowspan"].value : "1"
        childDivStyle["grid-column-end"] = "span " + colspan
        childDivStyle["grid-row-end"] = "span " + rowspan
        applyStyle(childDiv, childDivStyle)
    }
    applyStyle(mygrid, gridStyle)

}


function getDataRecordByState(data, state) {

    for (i = 0; i < data.length; i++) {
        if (data[i].state == state) {
            return data[i]
        }
    }
    // data.forEach(record=>{
    //     if (record.state == state){
    //         return record
    //     }
    // })
}



fieldMapping = {
    "n_killed": "Lives Lost",
    "n_injured": "People Injured",
    "n_guns_involved": "Guns Involved",
    "lawtotal": "State Laws"
}


findStateCode = {
    "Alabama": "AL",
    "Alaska": "AK",
    "American Samoa": "AS",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District Of Columbia": "DC",
    "Federated States Of Micronesia": "FM",
    "Florida": "FL",
    "Georgia": "GA",
    "Guam": "GU",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Marshall Islands": "MH",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Northern Mariana Islands": "MP",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Palau": "PW",
    "Pennsylvania": "PA",
    "Puerto Rico": "PR",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virgin Islands": "VI",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
}

findStateName = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}


// For Range Slider
rangeSliderList1 = [
    "January 2014",
    "February 2014",
    "March 2014",
    "April 2014",
    "May 2014",
    "June 2014",
    "July 2014",
    "August 2014",
    "September 2014",
    "October 2014",
    "November 2014",
    "December 2014",
    "January 2015",
    "February 2015",
    "March 2015",
    "April 2015",
    "May 2015",
    "June 2015",
    "July 2015",
    "August 2015",
    "September 2015",
    "October 2015",
    "November 2015",
    "December 2015",
    "January 2016",
    "February 2016",
    "March 2016",
    "April 2016",
    "May 2016",
    "June 2016",
    "July 2016",
    "August 2016",
    "September 2016",
    "October 2016",
    "November 2016",
    "December 2016",
    "January 2017",
    "February 2017",
    "March 2017",
    "April 2017",
    "May 2017",
    "June 2017",
    "July 2017",
    "August 2017",
    "September 2017",
    "October 2017",
    "November 2017",
    "December 2017",
    "January 2018",
    "February 2018",
    "March 2018"
]

rangeSliderList = [
    "Jan 2014",
    "Feb 2014",
    "Mar 2014",
    "Apr 2014",
    "May 2014",
    "Jun 2014",
    "Jul 2014",
    "Aug 2014",
    "Sep 2014",
    "Oct 2014",
    "Nov 2014",
    "Dec 2014",
    "Jan 2015",
    "Feb 2015",
    "Mar 2015",
    "Apr 2015",
    "May 2015",
    "Jun 2015",
    "Jul 2015",
    "Aug 2015",
    "Sep 2015",
    "Oct 2015",
    "Nov 2015",
    "Dec 2015",
    "Jan 2016",
    "Feb 2016",
    "Mar 2016",
    "Apr 2016",
    "May 2016",
    "Jun 2016",
    "Jul 2016",
    "Aug 2016",
    "Sep 2016",
    "Oct 2016",
    "Nov 2016",
    "Dec 2016",
    "Jan 2017",
    "Feb 2017",
    "Mar 2017",
    "Apr 2017",
    "May 2017",
    "Jun 2017",
    "Jul 2017",
    "Aug 2017",
    "Sep 2017",
    "Oct 2017",
    "Nov 2017",
    "Dec 2017",
    "Jan 2018",
    "Feb 2018",
    "Mar 2018"
]

monthMap = {
    "Jan" : "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12"
}