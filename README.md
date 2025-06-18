## Deployement with Render ##

Static Service - Frontend React app<br>
Web Service - Backend Node.js + Express.js<br>

Asteroid Dashboard Found [Here](https://asteroid-risk-assessment-dashboard.onrender.com/)

## Installation Guide ##

## Available Endpoints ##

### Risk Assessment Endpoints: ###
  GET /neo/risk-assessment - Complete risk analysis for today<br>
  GET /neo/risk-assessment/:date - Complete risk analysis for specific date<br>
  GET /neo/highest-risk?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&limit=10 - Top highest risk NEOs<br>

### Chart Focused Endpoints: ###
  GET /neo/charts/size-distribution - Pie/bar chart data for size categories (today)<br>
  GET /neo/charts/size-distribution/:date - Pie/bar chart data for specific date<br>
  GET /neo/charts/distance-size - Scatter plot data (today)<br>
  GET /neo/charts/distance-size/:date - Scatter plot data for specific date<br>
  GET /neo/charts/timeline?days=7 - Time series data for line charts<br>
  GET /neo/simple - Clean table/card data (today)<br>
  GET /neo/simple/:date - Clean table/card data for specific date<br>

### Basic Neo Date: ###
  GET /neo/today - Today's Near Earth Objects<br>
  GET /neo/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - NEOs for date range<br>
  GET /neo/hazardous?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - Potentially hazardous NEOs<br>
  GET /neo/stats - NEO statistics from NASA<br>
  GET /neo/:id - Specific NEO details by ID<br>
  GET /neo/closest - 5 closest approaching NEOs today<br>
  GET /neo/largest - 5 largest NEOs by diameter today<br>
  GET /neo/summary - Summary metrics for today<br>
  GET /neo/summary/:date - Summary metrics for specific date<br>

