## Deployment with Render ##

Static Service - Frontend React app<br>
Web Service - Backend Node.js + Express.js<br>

Asteroid Dashboard Found [Here](https://asteroid-risk-assessment-dashboard.onrender.com/)

## Local Installation Guide ##

1. Clone this repository
2. Get a NASA API Key from [here](https://api.nasa.gov/)
3. Go into the `asteroid_express_app` directory and create a .env file. You need a `PORT` secret variable and a `NASA_API_KEY` secret variable. The `PORT` variable will dictate which local host port the backend will listen on.
3. Go into both directories (frontend/backend) and install the necessary dependencies with `npm install`. You need to be within the same directorys as `package.json` for this to work. Both respective directories: `asteroid_app` and `asteroid_express_app`.
4. To run the frontend use the command `npm run dev`. You need to be in the `asteroid_app` directory.
5. To run the backend node server, go into the `asteroid_express_app` directory and run `npm start`.

## Available Endpoints ##

NEO - Near Earth Object

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

### Basic Neo Information Endpoints: ###
GET /neo/today - Today's Near Earth Objects<br>
GET /neo/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - NEOs for date range<br>
GET /neo/hazardous?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - Potentially hazardous NEOs<br>
GET /neo/stats - NEO statistics from NASA<br>
GET /neo/:id - Specific NEO details by ID<br>
GET /neo/closest - 5 closest approaching NEOs today<br>
GET /neo/largest - 5 largest NEOs by diameter today<br>
GET /neo/summary - Summary metrics for today<br>
GET /neo/summary/:date - Summary metrics for specific date<br>

