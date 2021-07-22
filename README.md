# Visualisation-US-Gun-Violence
My project at Stony Brook University for the course CSE 564: Visualization under Prof. Klaus Mueller.

Check the youtube link for an overview: https://www.youtube.com/watch?v=DROVFLHg2Ps&list=PLyCRt3MN8s8OJp-M5UdCQv-NDllAqJOb5&index=10 

Data Used: https://www.kaggle.com/jameslko/gun-violence-data

Extensive pre-processing was performed before loading the data on the screen.

Development Stack:-
Web Technologies: **HTML, CSS, VanillaJS**; Libraries: **D3.js(v4)**
Frameworks: **Flask, Bootstrap**
Backend: **Python3**; Libraries: **Pandas, Numpy**


This project is a single page web application giving in-depth details and insights on the US Gun Violence statistics from the year January 2013 - March 2018.

Following are the key components were added to the dashboard:
1. **Time Range** : A month-year range slider on the top of the screen basis which the data in the rest of the dashboard will be populated.
2. **Category Buttons**: This defines the metric that will be used through all the components in the dashboard. Color Schemes are used within the dashboard for comfortable and easy-to-understand user experience. By default it shows the overall count of the metric to provide an easy summarization.
3. **US Choropleth Map**: A US Map (created using GeoJSON data on D3.js) color coded with the intensity of the metric selected from the "Category Buttons" component. Interaction supported to drill down the data basis the selected state.
4. **Horizontal Bar Chart**: A Bar chart specifying the top cities in US/selected state. Also interaction supported to drill down the data basis the selected city.
5. **Line-Bar-Chart**: A chart specifying the growth of the selected metric as compared to the gun laws over the years. 
6. **Radar Chart/Spider chart**: Chart containing multivariate data displaying the volume of top violence characteristics of the selected metric over the US/selected city. Categories were identified where innocent minors got involved in the gun-related incidents.
7. **Word Cloud**: Word cloud displaying the guns(and their relative usage) in gun-related incidents over the US/selected city.
