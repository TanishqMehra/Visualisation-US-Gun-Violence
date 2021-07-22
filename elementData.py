# %%
import pandas as pd
import numpy as np
from flask import render_template, Flask, request, jsonify
import json
import re

#%%
app = Flask(__name__)

# %%
cleaned_data = pd.read_csv("data/clean-trim-processed-data-gun-violence.csv")
laws_data = pd.read_csv("data/us-state-firearm-laws.csv")
chart_data = None
# %%
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

# %%
def timeRangeData(time_range: list = None):
    global chart_data
    if not time_range is None:
        from_date_ = pd.to_datetime(time_range[0], format='%Y-%m')
        to_date_ = pd.to_datetime(time_range[1], format='%Y-%m')

        # print(from_date_, to_date_)

        date_vector_ = pd.to_datetime(cleaned_data['year_month'], format='%Y-%m')
        # print(date_vector_)
        chart_data = cleaned_data[(
            date_vector_ >= from_date_) & (date_vector_ <= to_date_)]

    else:
        chart_data = cleaned_data

# %%
def datamap(main_stats='n_killed'):
    '''
    The function returns pandas dataframe with two columns 
    ["state", "value"] for the datamap element of the 
    dashboard.

    [{
    state: "CA",
    value: 200
    }]
    '''

    local_selection_list = ['state', main_stats]
    local_data_ = chart_data[local_selection_list]
    local_data_.rename(columns={main_stats: 'value'}, inplace=True)
    final_data = local_data_.groupby('state').sum()
    final_data = final_data.astype('int64')
    final_data.reset_index(inplace=True)

    return final_data.to_dict(orient='records')

# %%
def metrics(selection: str = 'us', selection_value: str = None):
    '''
    This function returns object for the metrics element of the
    dashboard.

    selection : "us" or "state" or "city_or_county"
    selection_value : depends on selection, not needed for "us"

    {
    "n_killed": 200,
    "n_injured": 6110,
    "n_guns_involved": 250,
    "n_incidents" : 235,
    }
    '''

    final_data = None
    local_selection_list = ['n_killed', 'n_injured',
                            'n_incidents', 'n_guns_involved']

    if selection == 'us':
        final_data = chart_data[local_selection_list]
        final_data = final_data.astype('int64')
        final_data = final_data.sum()

    elif selection == 'city_or_county':
        final_data = chart_data[chart_data['city_or_county'] == selection_value]
        final_data = final_data[local_selection_list]
        final_data = final_data.astype('int64')
        final_data = final_data.sum()

    elif selection == 'state':
        final_data = chart_data[chart_data['state'] == selection_value]
        final_data = final_data[local_selection_list]
        final_data = final_data.astype('int64')
        final_data = final_data.sum()

    else:
        return final_data

    return final_data.to_dict()

# %%
def barChart(selection: str = 'us', selection_value: str = None, main_stats: str = 'n_killed', top_n: int = 10):
    '''
    This function returns array of objects for the barChart element
    of the dashboard.

    selection : "us" or "state"
    selection_value : depends on selection, not needed for "us"
    top_n : Top n counties from the frame

    [{'city_or_county': 'Birmingham', 'value': 101},
    {'city_or_county': 'Montgomery', 'value': 62},
    {'city_or_county': 'Mobile', 'value': 42}]
    '''

    final_data = None
    local_selection_list = ['city_or_county', main_stats]

    if selection == 'us':
        local_data_ = chart_data[local_selection_list]

    elif selection == 'state':
        local_data_ = chart_data[chart_data['state'] == selection_value]
        local_data_ = local_data_[local_selection_list]

    else:
        return final_data

    grouped_local_data = local_data_.groupby('city_or_county').sum()
    grouped_local_data = grouped_local_data.astype('int64')
    grouped_local_data.reset_index(inplace=True)
    final_data = grouped_local_data.sort_values(
        main_stats, ascending=False)[:top_n]
    final_data.rename(columns={'city_or_county':'key', main_stats: 'value'}, inplace=True)

    return final_data.to_dict(orient='records')

# %%
def lineGraph(selection: str = 'us', selection_value: str = None, main_stats: str = 'n_killed'):
    '''

    This function returns array of objects for the lineGraph
    element of the dashboard.

    selection : "us" or "state"
    selection_value : depends on selection, not needed for "us"

    [
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
    '''
    final_data = None
    local_selection_list = ['year', main_stats]
    local_law_selection_list = ['year', 'lawtotal']

    if selection == 'us':
        local_data_ = chart_data[local_selection_list]
        local_law_data_ = laws_data[local_law_selection_list]

    elif selection == 'state':
        local_data_ = chart_data[chart_data['state'] == selection_value]
        local_data_ = local_data_[local_selection_list]
        local_law_data_ = laws_data[laws_data['state'] == selection_value]
        local_law_data_ = local_law_data_[local_law_selection_list]

    else:
        return final_data

    agg_local_data_ = local_data_.groupby('year').sum().astype('int64').reset_index()
    agg_local_data_.rename(columns={main_stats: 'count'}, inplace=True)
    agg_local_law_data_ = local_law_data_.groupby('year').sum().astype('int64').reset_index()
    final_data = agg_local_data_.merge(agg_local_law_data_, on=['year'])

    return final_data.to_dict(orient='records')

# %%
def radarChart(selection: str = 'us', selection_value: str = None):
    '''
    This function returns nested array of objects for the radarChart
    element of the dashboard.

    selection : "us" or "state" or "city_or_county"
    selection_value : depends on selection, not needed for "us"

    [
        { name: 'Minors Involved',
            axes: [
                {axis: 'Gang Involvement', value: 42},
                {axis: 'Mass Shooting', value: 60},
                {axis: 'Suicide', value: 26},
                {axis: 'Drug Involvement', value: 40},
                {axis: 'Bar/club incident', value: 40},
                {axis: 'House Party', value: 12}
            ]
        },
        { name: 'Adults Only',
            axes: [
                {axis: 'Gang Involvement', value: 50},
                {axis: 'Mass Shotting', value: 20},
                {axis: 'Suicide', value: 20},
                {axis: 'Drug Involvement', value: 40},
                {axis: 'Bar/club incident', value: 30},
                {axis: 'House Party', value: 45}
            ]
        }
    ]
    '''
    final_data_dict_ = {
        'Minors Involved':{
            'Gang involvement':0,
            'Mass Shooting':0,
            'Suicide':0,
            'Drug involvement':0,
            'Bar/club incident':0,
            'House party':0
        },
        'Adults Only':{
            'Gang involvement':0,
            'Mass Shooting':0,
            'Suicide':0,
            'Drug involvement':0,
            'Bar/club incident':0,
            'House party':0
        }
    }

    final_data = [
        {
            'name': 'Minors Involved',
            'axes': [
                {'axis': 'Gang involvement', 'value': 0},
                {'axis': 'Mass Shooting', 'value': 0},
                {'axis': 'Suicide', 'value': 0},
                {'axis': 'Drug involvement', 'value': 0},
                {'axis': 'Bar/club incident', 'value': 0},
                {'axis': 'House party', 'value': 0}
            ]   
        },
        {   'name': 'Adults Only',
            'axes': [
                {'axis': 'Gang involvement', 'value': 0},
                {'axis': 'Mass Shooting', 'value': 0},
                {'axis': 'Suicide', 'value': 0},
                {'axis': 'Drug involvement', 'value': 0},
                {'axis': 'Bar/club incident', 'value': 0},
                {'axis': 'House party', 'value': 0}
            ]
        }
    ]

    # def calculateValues(row):
        # print(row)
        # population_type_ = ''
        # # for index, row in local_data_.iterrows():
        # if  not row['participant_age_group'] is np.nan and ('Teen' in row['participant_age_group'] or 'Child' in row['participant_age_group']):
        #     population_type_ = 'Minors Involved'
        # else:
        #     population_type_ = 'Adults Only'

        # for inner_dict_ in final_data_dict_[population_type_]:
        #     if not row['incident_characteristics'] is np.nan and inner_dict_ in row['incident_characteristics']:
        #         final_data_dict_[population_type_][inner_dict_] += 1

    # local_selection_list = ['participant_age_group', 'incident_characteristics']
    local_selection_list = ['Minors Involved', 'Gang involvement', 'Mass Shooting', 'Suicide', 'Drug involvement', 
        'Bar/club incident', 'House party']
    
    if selection == 'us':
        local_data_ = chart_data[local_selection_list]

    elif selection == 'city_or_county':
        local_data_ = chart_data[chart_data['city_or_county'] == selection_value]
        local_data_ = local_data_[local_selection_list]

    elif selection == 'state':
        local_data_ = chart_data[chart_data['state'] == selection_value]
        local_data_ = local_data_[local_selection_list]

    else:
        return final_data

    # local_data_.apply(calculateValues, axis=1)
    # # population_type_ = ''
    # # for index, row in local_data_.iterrows():
    # #     if  not row['participant_age_group'] is np.nan and ('Teen' in row['participant_age_group'] or 'Child' in row['participant_age_group']):
    # #         population_type_ = 'Minors Involved'
    # #     else:
    # #         population_type_ = 'Adults Only'

    # #     axes_array_ = []
    # #     for main_dict_ in final_data:
    # #         if main_dict_['name'] == population_type_:
    # #             axes_array_ = main_dict_['axes']
    # #             break
        
    # #     for axis_dict_ in axes_array_:
    # #         if not row['incident_characteristics'] is np.nan and axis_dict_['axis'] in row['incident_characteristics']:
    # #             axis_dict_['value'] += 1

    # for main_dict_ in final_data:
    #     pop_type_ = main_dict_['name']
    #     if pop_type_ == 'Minors Involved':
    #         minor_stats_ = local_data_[local_data_['Minors Involved'] == 1].sum()
    #         for axis_ in main_dict_['axes']:
    #             incident_type_ = axis_['axis']
    #             axis_['value'] = minor_stats_[incident_type_]

    #     else:
    #         adult_stats_ = local_data_[local_data_['Minors Involved'] == 0].sum()
    #         for axis_ in main_dict_['axes']:
    #             incident_type_ = axis_['axis']
    #             axis_['value'] = adult_stats_[incident_type_]



    for main_dict_ in final_data:
        pop_type_ = main_dict_['name']
        if pop_type_ == 'Minors Involved':
            minor_stats_ = local_data_[local_data_['Minors Involved'] == 1][local_selection_list[1:]].sum()
            minor_stats_ = np.array(minor_stats_)
            if not np.linalg.norm(minor_stats_) == 0:
                minor_stats_ = minor_stats_/ np.linalg.norm(minor_stats_)
            minor_stats_ = pd.Series(minor_stats_, index=local_selection_list[1:])
            for axis_ in main_dict_['axes']:
                incident_type_ = axis_['axis']
                axis_['value'] = minor_stats_[incident_type_]

        else:
            adult_stats_ = local_data_[local_data_['Minors Involved'] == 0][local_selection_list[1:]].sum()
            adult_stats_ = np.array(adult_stats_)
            if not np.linalg.norm(adult_stats_) == 0:
                adult_stats_ = adult_stats_/ np.linalg.norm(adult_stats_)
            adult_stats_ = pd.Series(adult_stats_, index=local_selection_list[1:])
            for axis_ in main_dict_['axes']:
                incident_type_ = axis_['axis']
                axis_['value'] = adult_stats_[incident_type_]

        # for axis_ in main_dict_['axes']:
        #     incident_type_ = axis_['axis']
        #     axis_['value'] = final_data_dict_[pop_type_][incident_type_]

    return final_data
    # return final_data_dict_

# %%
def wordCloud(selection: str = 'us', selection_value: str = None):

    final_data_dict = {}
    final_data = []

    def fillFinalData(str_: str):
        # print(str_)
        if str_ is np.nan: return 
        type_s = [re.split(r':+', ind_str_)[1] for ind_str_ in re.split(r'\|+', str_)]
        for type_ in type_s:
            if not type_ == "Unknown" and not type_ == "Other":
                if not type_ in final_data_dict:
                    final_data_dict[type_] = 1
                else:
                    final_data_dict[type_] += 1

    local_selection_list = ['gun_type']

    if selection == 'us':
        local_data_ = chart_data[local_selection_list]

    elif selection == 'city_or_county':
        local_data_ = chart_data[chart_data['city_or_county'] == selection_value]
        local_data_ = local_data_[local_selection_list]

    elif selection == 'state':
        local_data_ = chart_data[chart_data['state'] == selection_value]
        local_data_ = local_data_[local_selection_list]

    else:
        return final_data

    local_data_.applymap(fillFinalData)

    print(final_data_dict)
    final_data_dict_sorted_ = dict(sorted(final_data_dict.items(), key = lambda it: it[1]))
    values_ = np.linspace(20, 70, len(final_data_dict))
    print(final_data_dict_sorted_)

    for index_, key_ in enumerate(final_data_dict_sorted_):
        final_data_dict[key_] = values_[index_]

    print(final_data_dict)

    for key_, value_ in final_data_dict.items():
        # print(key, value)
        final_data.append({"gun":key_, "count":value_})


    return final_data

#%%
@app.route('/')
def justRender():
    timeRangeData()
    data = {}
    data['datamap'] = datamap()
    data['metrics'] = metrics()
    data['barChart'] = barChart()
    data['lineChart'] = lineGraph()
    data['wordCloud'] = wordCloud()
    data['radarChart'] = radarChart()
    return render_template('flask_comm_test.html', chart_data=data)

@app.route('/get_data', methods = ['POST', 'GET'])
def getData():

    selection_ = ""
    selection_val_ = ""
    main_stats_ = ""

    if request.method == 'GET':
        print(type(request.get_json()))  # parse as JSON
        return jsonify('Sucesss')
    else:
        req_dict_ = request.get_json()  # parse as JSON
        print(req_dict_)
        if 'timerange' in req_dict_: 
            # print("Calling the timeRange")
            timeRangeData(req_dict_['timerange'])
        else:timeRangeData()
        if 'selection' in req_dict_: selection_ = req_dict_['selection']
        if 'value' in req_dict_: selection_val_ = req_dict_['value']
        if 'mainStatistics' in req_dict_: main_stats_ = req_dict_['mainStatistics']

        data = {}
        data['datamap'] = datamap(main_stats_)
        data['metrics'] = metrics(selection_, selection_val_)
        data['barChart'] = barChart(selection_, selection_val_, main_stats_)
        data['lineChart'] = lineGraph(selection_, selection_val_, main_stats_)
        data['wordCloud'] = wordCloud(selection_, selection_val_)
        data['radarChart'] = radarChart(selection_, selection_val_)
        return jsonify(data)

# %%
app.debug = True
app.run()