## Deployment with Render

Static Service - Frontend React app<br>
Web Service - Backend Node.js + Express.js<br>

Asteroid Dashboard Found [Here](https://asteroid-risk-assessment-dashboard.onrender.com/)

## Local Installation Guide

1. Clone this repository
2. Get a NASA API Key from [here](https://api.nasa.gov/)
3. Go into the `asteroid_express_app` directory and create a `.env` file. You need a `PORT` secret variable and a `NASA_API_KEY` secret variable. The `PORT` variable will dictate which local host port the backend will listen on. E.g `3000`
4. Go into the `asteriod_app` directory and create a `.env.local` file. You need a `VITE_API_BASE_URL` secret variable. This secret variable will be used by the frontend to communicate with your backend. The value of this secret variable should be the url your local host backend. E.g `http://localhost:3000`. This secret variable is only for local development.
5. Go into both directories `asteroid_app` and `asteroid_express_app` and install the necessary dependencies with `npm install`. This two directories are sub-directories of `frontend/` and `backend/`.
6. To run the frontend use the command `npm run dev`. You need to be in the `asteroid_app` directory.
7. To run the backend node server, go into the `asteroid_express_app` directory and run `npm start`.

## Notes

NEO - Near Earth Object

This API provides comprehensive asteroid data, risk assessments, and visualization-ready data.

## Available Endpoints

## Risk Assessment

**Analyze Potential threats and get detailed risk scoring**

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /neo/risk-assessment` | Complete risk analysis for today | None |
| `GET /neo/risk-assessment/:date` | Risk analysis for specific date | `date` - Format: YYYY-MM-DD |
| `GET /neo/highest-risk` | Top highest risk NEOs in date range | `start_date`, `end_date`, `limit` (default: 10) |

**Example:** `/neo/risk-assessment/2024-06-15` - Get risk assessment for June 15th, 2024

---

## Chart & Visualization Data

**Ready-to-use data for dashboards and charts**

### Size Distribution Charts
| Endpoint | Description |
|----------|-------------|
| `GET /neo/charts/size-distribution` | Pie/bar chart data for today's asteroids |
| `GET /neo/charts/size-distribution/:date` | Size categories for specific date |

### Scatter Plot Data
| Endpoint | Description |
|----------|-------------|
| `GET /neo/charts/distance-size` | Distance vs size data for today |
| `GET /neo/charts/distance-size/:date` | Scatter plot data for specific date |

### Timeline & Table Data
| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /neo/charts/timeline` | Time series data for line charts | `days` (default: 7) |
| `GET /neo/simple` | Clean table/card data for today | None |
| `GET /neo/simple/:date` | Formatted data for specific date | `date` - Format: YYYY-MM-DD |

**Example:** `/neo/charts/timeline?days=14` - Get 2 weeks of timeline data

---

## Basic NEO Information

**Core asteroid data and NASA information**

### Today's Data
| Endpoint | Description |
|----------|-------------|
| `GET /neo/today` | All Near Earth Objects for today |
| `GET /neo/closest` | 5 closest approaching asteroids today |
| `GET /neo/largest` | 5 largest asteroids by diameter today |
| `GET /neo/summary` | Key metrics and statistics for today |

### Date-Specific & Range Queries
| Endpoint | Description | Required Parameters |
|----------|-------------|-------------------|
| `GET /neo/feed` | NEOs within date range | `start_date`, `end_date` |
| `GET /neo/hazardous` | Potentially dangerous asteroids | `start_date`, `end_date` |
| `GET /neo/summary/:date` | Summary metrics for specific date | `date` |

### Individual & Statistics
| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /neo/:id` | Detailed info for specific asteroid | `id` - NEO identifier |
| `GET /neo/stats` | Overall NEO statistics from NASA | None |

---

## Date Format

All dates should be in **YYYY-MM-DD** format (e.g., `2024-06-18`)

## Query Parameters

- **start_date** / **end_date**: Date range (max 7 days apart)
- **limit**: Number of results to return
- **days**: Number of days for timeline data

## Quick Examples

```bash
# Get today's risk assessment
curl 'https://asteroid-dashboard-backend.onrender.com/neo/risk-assessment'

# Find dangerous asteroids for a specified week (Max 7 days apart only)
curl 'https://asteroid-dashboard-backend.onrender.com/neo/hazardous?start_date=2024-06-13&end_date=2024-06-20'

# Get chart data for a specific date
curl 'https://asteroid-dashboard-backend.onrender.com/neo/charts/size-distribution/2024-06-15'

# Timeline for dashboard (30 days)
curl 'https://asteroid-dashboard-backend.onrender.com/neo/charts/timeline?days=30'
```

---

## Technical Breakdown

This project has two aspects. A frontend and backend. The frontend is React.js with Vite. While the backend is a simple Node.js server with Express. The backend is represented through a singular file called `server.js`. Inside that file are routes that implement endpoints. Each route calls a particular endpoint on NASA's NeoWs (Near Earth Object Web Service) public API. Each route calls an endpoint to retrieve some NASA data. That data is then returned as JSON. To increase the performance of the backend server, simple cache has been implemented. The cache has a time to live of 24 hours. This is very optimal as the NASA data rarely ever changes. This is a configurable value on `server.js`.

As for the frontend, an API interface `client.js` was created. This is more efficient as we can abstract the fetch logic behind a class or specific instances tied to particular services. That way we don't need to write the fetch logic everytime we create or modify react components. You can interact with the API interface in three different ways:

1. Through the `neoAPI` object:

```
import { neoAPI } from './api/client';

// Simple, clean syntax
const data = await neoAPI.today();
const feed = await neoAPI.feed('2024-01-01', '2024-01-07');
const charts = await neoAPI.sizeDistribution();
```

2. Individual Service Instances:

```
import { neoService, neoChartsService, neoRiskService } from './api/client';

// More explicit, organized by functionality
const data = await neoService.getNeoToday();
const charts = await neoChartsService.getSizeDistribution();
const risk = await neoRiskService.getRiskAssessment();
```

3. Raw ApiClient:

```
import { ApiClient } from './api/client';

const client = new ApiClient('https://my-api.com');
const customData = await client.get('/custom/endpoint');
```

The frontend styling is handled with just Tailwind CSS for its ease of implementation of responsiveness across different screen sizes. The react structure was implemented through pages and components. Each page is responsible for rendering its component(s) that has been specified in the code. Although dedicated testing with Jest and React Testing Library has yet to be implemented, there are some basic test scripts you can still run. In `src/api` you can find two basic test files, `test_api_local.js` and `test_api_prod.js`. Just use the following command `node test_api_local.js` to test your local backend. The other file tests to see if the deployed API, (in my case the API deployed on Render) sends back correct responses to API calls. You can change the URL in `test_api_prod.js` to see if your deployed API works.

---

## User Interface

The user interface is very straight forward. You navigate entirely through the navigation bar at the top of the page. There are three pages:

1. The Risk Assessment Page
2. The Visualizations Page
3. The Individual NEO (Near Earth Object) Page

The Risk Assessment page displays today's risk assessment along with today's highest risk near earth objects. This page updates everyday. You can use also filter by a specific date to see information on that date. 

The Visualizations page offers some interesting data visualizations in the form of pie chart, bar chart, scatter plot and timeline. Here you can also filter by a specific date. You can also hide parts of the user interface through buttons.

The Individual Near Earth Object page by far provides the most amount of information. On this page you can search for a specific Near Earth Object. You just type the ID of the Near Earth Object and hit enter or the submit button. 
