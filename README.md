## Deployment with Render

Static Service - Frontend React app<br>
Web Service - Backend Node.js + Express.js<br>

Asteroid Dashboard Found [Here](https://asteroid-risk-assessment-dashboard.onrender.com/)

## Local Installation Guide

1. Clone this repository
2. Get a NASA API Key from [here](https://api.nasa.gov/)
3. Go into the `asteroid_express_app` directory and create a .env file. You need a `PORT` secret variable and a `NASA_API_KEY` secret variable. The `PORT` variable will dictate which local host port the backend will listen on.
3. Go into both directories `asteroid_app` and `asteroid_express_app` and install the necessary dependencies with `npm install`. This two directories are sub-directories of `frontend/` and `backend/`.
4. To run the frontend use the command `npm run dev`. You need to be in the `asteroid_app` directory.
5. To run the backend node server, go into the `asteroid_express_app` directory and run `npm start`.

## Notes

NEO - Near Earth Object

This API provides comprehensive asteroid data, risk assessments, and visualization-ready datasets.

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
curl /neo/risk-assessment

# Find dangerous asteroids this week
curl /neo/hazardous?start_date=2024-06-18&end_date=2024-06-25

# Get chart data for a specific date
curl /neo/charts/size-distribution/2024-06-15

# Timeline for dashboard (30 days)
curl /neo/charts/timeline?days=30
```

