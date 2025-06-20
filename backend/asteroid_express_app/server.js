require("dotenv").config();

const express = require("express");
const cors = require("cors");
const NodeCache = require("node-cache");

const app = express();

// Cache with 15-minute TTL (900 seconds)
const cache = new NodeCache({ stdTTL: 900 });

const port = process.env.PORT || 3000;
const api_key = process.env.NASA_API_KEY;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://asteroid-risk-assessment-dashboard.onrender.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Helper function to get cached data or fetch from NASA
async function getCachedOrFetch(cacheKey, fetchFunction) {
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Cache HIT for key: ${cacheKey}`);
    return cachedData;
  }

  console.log(`Cache MISS for key: ${cacheKey} - Fetching from NASA...`);

  // Cache miss - fetch from NASA
  const data = await fetchFunction();

  // Store in cache
  cache.set(cacheKey, data);
  console.log(`Cached data for key: ${cacheKey}`);

  return data;
}

// Routes

// Base route
app.get("/", (req, res) => {
  res.send("Custom API with Caching");
});

// Cache statistics endpoint (for development)
// Commented out in production for obivious reasons

// app.get("/cache/stats", (req, res) => {
//   const stats = cache.getStats();
//   const keys = cache.keys();

//   res.json({
//     cache_stats: {
//       keys_count: keys.length,
//       hits: stats.hits,
//       misses: stats.misses,
//       hit_rate: stats.hits / (stats.hits + stats.misses) || 0,
//       keys: keys,
//     },
//     ttl_seconds: 900,
//     ttl_minutes: 15,
//   });
// });

// Clear cache endpoint (for development)
// Commented out for obivious reasons

// app.get("/cache/clear", (req, res) => {
//   cache.flushAll();
//   res.json({ message: "Cache cleared successfully" });
// });

// Get Near Earth Objects for today
app.get("/neo/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `neo-today-${today}`;

    const data = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      return await response.json();
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching NEO data:", error);
    res.status(500).json({ error: "Failed to fetch NEO data" });
  }
});

// Get NEOs for a date range
app.get("/neo/feed", async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        error:
          "start_date and end_date query parameters are required (YYYY-MM-DD format)",
      });
    }

    const cacheKey = `neo-feed-${start_date}-${end_date}`;

    const data = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      return await response.json();
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching NEO feed:", error);
    res.status(500).json({ error: "Failed to fetch NEO feed data" });
  }
});

// Get only potentially hazardous asteroids for a date range
app.get("/neo/hazardous", async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const startDate = start_date || new Date().toISOString().split("T")[0];
    const endDate = end_date || startDate;

    const cacheKey = `neo-hazardous-${startDate}-${endDate}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();

      // Filter for potentially hazardous asteroids
      const hazardousAsteroids = [];
      Object.entries(data.near_earth_objects).forEach(([date, neos]) => {
        neos.forEach((neo) => {
          if (neo.is_potentially_hazardous_asteroid) {
            hazardousAsteroids.push({
              ...neo,
              approach_date: date,
            });
          }
        });
      });

      return {
        date_range: { start_date: startDate, end_date: endDate },
        total_hazardous: hazardousAsteroids.length,
        asteroids: hazardousAsteroids,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching hazardous NEOs:", error);
    res.status(500).json({ error: "Failed to fetch hazardous NEO data" });
  }
});

// Get NEO statistics and summary
app.get("/neo/stats", async (req, res) => {
  try {
    const cacheKey = "neo-stats";

    const data = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/stats?api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      return await response.json();
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching NEO stats:", error);
    res.status(500).json({ error: "Failed to fetch NEO statistics" });
  }
});

// Get closest approaching NEOs for today
app.get("/neo/closest", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `neo-closest-${today}`;
    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${api_key}`
      );
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }
      const data = await response.json();
      // Extract all NEOs and find the closest ones
      const allNeos = Object.values(data.near_earth_objects).flat();
      // Sort by closest approach distance
      const sortedByDistance = allNeos
        .map((neo) => ({
          ...neo,
          closest_distance_km: parseFloat(
            neo.close_approach_data[0]?.miss_distance?.kilometers || 0
          ),
        }))
        .sort((a, b) => a.closest_distance_km - b.closest_distance_km)
        .slice(0, 5); // Get top 5 closest
      return {
        date: today,
        closest_neos: sortedByDistance,
      };
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching closest NEOs:", error);
    res.status(500).json({ error: "Failed to fetch closest NEO data" });
  }
});

// Get largest NEOs by estimated diameter for today
app.get("/neo/largest", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `neo-largest-${today}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract all NEOs and find the largest ones
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Sort by estimated max diameter
      const sortedBySize = allNeos
        .map((neo) => ({
          ...neo,
          max_diameter_km:
            neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
        }))
        .sort((a, b) => b.max_diameter_km - a.max_diameter_km)
        .slice(0, 5); // Get top 5 largest

      return {
        date: today,
        largest_neos: sortedBySize,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching largest NEOs:", error);
    res.status(500).json({ error: "Failed to fetch largest NEO data" });
  }
});

// Get NEO summary with key metrics for a date
app.get("/neo/summary", async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const cacheKey = `neo-summary-${date}`;

    const summary = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Calculate summary statistics
      return {
        date,
        total_count: allNeos.length,
        potentially_hazardous_count: allNeos.filter(
          (neo) => neo.is_potentially_hazardous_asteroid
        ).length,
        largest_diameter_km: Math.max(
          ...allNeos.map(
            (neo) =>
              neo.estimated_diameter?.kilometers?.estimated_diameter_max ||
              0
          )
        ),
        smallest_diameter_km: Math.min(
          ...allNeos.map(
            (neo) =>
              neo.estimated_diameter?.kilometers?.estimated_diameter_min ||
              Infinity
          )
        ),
        closest_approach_km: Math.min(
          ...allNeos.map((neo) =>
            parseFloat(
              neo.close_approach_data[0]?.miss_distance?.kilometers ||
                Infinity
            )
          )
        ),
        fastest_velocity_kmh: Math.max(
          ...allNeos.map((neo) =>
            parseFloat(
              neo.close_approach_data[0]?.relative_velocity
                ?.kilometers_per_hour || 0
            )
          )
        ),
        average_diameter_km:
          allNeos.reduce(
            (sum, neo) =>
              sum +
              (neo.estimated_diameter?.kilometers?.estimated_diameter_max ||
                0),
            0
          ) / allNeos.length,
      };
    });

    res.json(summary);
  } catch (error) {
    console.error("Error generating NEO summary:", error);
    res.status(500).json({ error: "Failed to generate NEO summary" });
  }
});

app.get("/neo/summary/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const cacheKey = `neo-summary-${date}`;

    const summary = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Calculate summary statistics
      return {
        date,
        total_count: allNeos.length,
        potentially_hazardous_count: allNeos.filter(
          (neo) => neo.is_potentially_hazardous_asteroid
        ).length,
        largest_diameter_km: Math.max(
          ...allNeos.map(
            (neo) =>
              neo.estimated_diameter?.kilometers?.estimated_diameter_max ||
              0
          )
        ),
        smallest_diameter_km: Math.min(
          ...allNeos.map(
            (neo) =>
              neo.estimated_diameter?.kilometers?.estimated_diameter_min ||
              Infinity
          )
        ),
        closest_approach_km: Math.min(
          ...allNeos.map((neo) =>
            parseFloat(
              neo.close_approach_data[0]?.miss_distance?.kilometers ||
                Infinity
            )
          )
        ),
        fastest_velocity_kmh: Math.max(
          ...allNeos.map((neo) =>
            parseFloat(
              neo.close_approach_data[0]?.relative_velocity
                ?.kilometers_per_hour || 0
            )
          )
        ),
        average_diameter_km:
          allNeos.reduce(
            (sum, neo) =>
              sum +
              (neo.estimated_diameter?.kilometers?.estimated_diameter_max ||
                0),
            0
          ) / allNeos.length,
      };
    });

    res.json(summary);
  } catch (error) {
    console.error("Error generating NEO summary:", error);
    res.status(500).json({ error: "Failed to generate NEO summary" });
  }
});

// Get chart-ready data for size distribution
app.get("/neo/charts/size-distribution", async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const cacheKey = `neo-size-distribution-${date}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Create size categories for chart
      const sizeCategories = {
        "Small (< 0.1 km)": 0,
        "Medium (0.1 - 1 km)": 0,
        "Large (1 - 10 km)": 0,
        "Very Large (> 10 km)": 0,
      };

      allNeos.forEach((neo) => {
        const maxDiameter =
          neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
        if (maxDiameter < 0.1) sizeCategories["Small (< 0.1 km)"]++;
        else if (maxDiameter < 1) sizeCategories["Medium (0.1 - 1 km)"]++;
        else if (maxDiameter < 10) sizeCategories["Large (1 - 10 km)"]++;
        else sizeCategories["Very Large (> 10 km)"]++;
      });

      // Format for pie/bar charts
      const chartData = Object.entries(sizeCategories).map(
        ([category, count]) => ({
          category,
          count,
          percentage: ((count / allNeos.length) * 100).toFixed(1),
        })
      );

      return {
        date,
        total_neos: allNeos.length,
        size_distribution: chartData,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating size distribution:", error);
    res
      .status(500)
      .json({ error: "Failed to generate size distribution data" });
  }
});

app.get("/neo/charts/size-distribution/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const cacheKey = `neo-size-distribution-${date}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Create size categories for chart
      const sizeCategories = {
        "Small (< 0.1 km)": 0,
        "Medium (0.1 - 1 km)": 0,
        "Large (1 - 10 km)": 0,
        "Very Large (> 10 km)": 0,
      };

      allNeos.forEach((neo) => {
        const maxDiameter =
          neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
        if (maxDiameter < 0.1) sizeCategories["Small (< 0.1 km)"]++;
        else if (maxDiameter < 1) sizeCategories["Medium (0.1 - 1 km)"]++;
        else if (maxDiameter < 10) sizeCategories["Large (1 - 10 km)"]++;
        else sizeCategories["Very Large (> 10 km)"]++;
      });

      // Format for pie/bar charts
      const chartData = Object.entries(sizeCategories).map(
        ([category, count]) => ({
          category,
          count,
          percentage: ((count / allNeos.length) * 100).toFixed(1),
        })
      );

      return {
        date,
        total_neos: allNeos.length,
        size_distribution: chartData,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating size distribution:", error);
    res
      .status(500)
      .json({ error: "Failed to generate size distribution data" });
  }
});

// Get chart-ready data for distance vs size scatter plot
app.get("/neo/charts/distance-size", async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const cacheKey = `neo-distance-size-${date}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Format for scatter plot
      const scatterData = allNeos.map((neo) => ({
        name: neo.name,
        id: neo.id,
        x: parseFloat(
          neo.close_approach_data[0]?.miss_distance?.kilometers || 0
        ),
        y: neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
        is_hazardous: neo.is_potentially_hazardous_asteroid,
        velocity: parseFloat(
          neo.close_approach_data[0]?.relative_velocity
            ?.kilometers_per_hour || 0
        ),
      }));

      return {
        date,
        scatter_data: scatterData,
        axis_labels: {
          x: "Distance from Earth (km)",
          y: "Estimated Max Diameter (km)",
        },
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating distance vs size data:", error);
    res
      .status(500)
      .json({ error: "Failed to generate distance vs size data" });
  }
});

app.get("/neo/charts/distance-size/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const cacheKey = `neo-distance-size-${date}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Format for scatter plot
      const scatterData = allNeos.map((neo) => ({
        name: neo.name,
        id: neo.id,
        x: parseFloat(
          neo.close_approach_data[0]?.miss_distance?.kilometers || 0
        ),
        y: neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
        is_hazardous: neo.is_potentially_hazardous_asteroid,
        velocity: parseFloat(
          neo.close_approach_data[0]?.relative_velocity
            ?.kilometers_per_hour || 0
        ),
      }));

      return {
        date,
        scatter_data: scatterData,
        axis_labels: {
          x: "Distance from Earth (km)",
          y: "Estimated Max Diameter (km)",
        },
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating distance vs size data:", error);
    res
      .status(500)
      .json({ error: "Failed to generate distance vs size data" });
  }
});

// Get time series data for multiple dates
app.get("/neo/charts/timeline", async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const cacheKey = `neo-timeline-${days}days`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const endDate = new Date();
      const startDate = new Date(
        endDate.getTime() - (days - 1) * 24 * 60 * 60 * 1000
      );

      const timelineData = [];

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];

        try {
          const response = await fetch(
            `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateStr}&end_date=${dateStr}&api_key=${api_key}`
          );

          if (response.ok) {
            const data = await response.json();
            const allNeos = Object.values(data.near_earth_objects).flat();

            timelineData.push({
              date: dateStr,
              total_count: allNeos.length,
              hazardous_count: allNeos.filter(
                (neo) => neo.is_potentially_hazardous_asteroid
              ).length,
              closest_distance: Math.min(
                ...allNeos.map((neo) =>
                  parseFloat(
                    neo.close_approach_data[0]?.miss_distance?.kilometers ||
                      Infinity
                  )
                )
              ),
              largest_diameter: Math.max(
                ...allNeos.map(
                  (neo) =>
                    neo.estimated_diameter?.kilometers
                      ?.estimated_diameter_max || 0
                )
              ),
            });
          }
        } catch (error) {
          // Skip failed requests silently
        }
      }

      return {
        timeline_data: timelineData,
        date_range: {
          start: startDate.toISOString().split("T")[0],
          end: endDate.toISOString().split("T")[0],
        },
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating timeline data:", error);
    res.status(500).json({ error: "Failed to generate timeline data" });
  }
});

// Risk assessment algorithm
function calculateRiskScore(neo) {
  let riskScore = 0;
  let riskFactors = [];

  // Factor 1: Size/Diameter (0-40 points)
  const diameterKm =
    neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
  if (diameterKm > 10) {
    riskScore += 40;
    riskFactors.push(
      "Extremely large size (>10km) - Extinction level threat"
    );
  } else if (diameterKm > 1) {
    riskScore += 30;
    riskFactors.push("Very large size (1-10km) - Regional devastation");
  } else if (diameterKm > 0.5) {
    riskScore += 20;
    riskFactors.push("Large size (0.5-1km) - City-level damage");
  } else if (diameterKm > 0.1) {
    riskScore += 15;
    riskFactors.push("Medium size (0.1-0.5km) - Local damage");
  } else if (diameterKm > 0.05) {
    riskScore += 8;
    riskFactors.push("Small size (0.05-0.1km) - Atmospheric explosion");
  } else {
    riskScore += 2;
    riskFactors.push("Very small size (<0.05km) - Minimal threat");
  }

  // Factor 2: Miss Distance (0-25 points)
  const missDistanceKm = parseFloat(
    neo.close_approach_data[0]?.miss_distance?.kilometers || Infinity
  );
  const lunarDistance = 384400; // km to moon

  if (missDistanceKm < lunarDistance * 0.1) {
    riskScore += 25;
    riskFactors.push("Extremely close approach (<0.1 lunar distances)");
  } else if (missDistanceKm < lunarDistance * 0.25) {
    riskScore += 20;
    riskFactors.push("Very close approach (<0.25 lunar distances)");
  } else if (missDistanceKm < lunarDistance * 0.5) {
    riskScore += 15;
    riskFactors.push("Close approach (<0.5 lunar distances)");
  } else if (missDistanceKm < lunarDistance) {
    riskScore += 10;
    riskFactors.push("Moderate approach (<1 lunar distance)");
  } else if (missDistanceKm < lunarDistance * 2) {
    riskScore += 5;
    riskFactors.push("Distant approach (<2 lunar distances)");
  } else {
    riskScore += 1;
    riskFactors.push("Very distant approach (>2 lunar distances)");
  }

  // Factor 3: Velocity (0-20 points)
  const velocityKmh = parseFloat(
    neo.close_approach_data[0]?.relative_velocity?.kilometers_per_hour || 0
  );
  if (velocityKmh > 100000) {
    riskScore += 20;
    riskFactors.push("Extremely high velocity (>100,000 km/h)");
  } else if (velocityKmh > 75000) {
    riskScore += 15;
    riskFactors.push("Very high velocity (75,000-100,000 km/h)");
  } else if (velocityKmh > 50000) {
    riskScore += 10;
    riskFactors.push("High velocity (50,000-75,000 km/h)");
  } else if (velocityKmh > 25000) {
    riskScore += 6;
    riskFactors.push("Moderate velocity (25,000-50,000 km/h)");
  } else {
    riskScore += 2;
    riskFactors.push("Low velocity (<25,000 km/h)");
  }

  // Factor 4: NASA Hazardous Flag (0-10 points)
  if (neo.is_potentially_hazardous_asteroid) {
    riskScore += 10;
    riskFactors.push("NASA classified as potentially hazardous");
  }

  // Factor 5: Approach frequency bonus (0-5 points)
  const approachCount = neo.close_approach_data?.length || 1;
  if (approachCount > 3) {
    riskScore += 5;
    riskFactors.push(
      `Frequent Earth approaches (${approachCount} recorded)`
    );
  } else if (approachCount > 1) {
    riskScore += 2;
    riskFactors.push(
      `Multiple Earth approaches (${approachCount} recorded)`
    );
  }

  // Calculate risk level
  let riskLevel, riskColor, riskDescription;
  if (riskScore >= 80) {
    riskLevel = "CRITICAL";
    riskColor = "#DC2626"; // Red
    riskDescription = "Extreme threat - Immediate monitoring required";
  } else if (riskScore >= 60) {
    riskLevel = "HIGH";
    riskColor = "#EA580C"; // Orange-red
    riskDescription = "High threat - Close monitoring recommended";
  } else if (riskScore >= 40) {
    riskLevel = "MODERATE";
    riskColor = "#D97706"; // Orange
    riskDescription = "Moderate threat - Regular monitoring";
  } else if (riskScore >= 20) {
    riskLevel = "LOW";
    riskColor = "#EAB308"; // Yellow
    riskDescription = "Low threat - Routine observation";
  } else {
    riskLevel = "MINIMAL";
    riskColor = "#16A34A"; // Green
    riskDescription = "Minimal threat - Standard tracking";
  }

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    risk_color: riskColor,
    risk_description: riskDescription,
    risk_factors: riskFactors,
    size_km: diameterKm,
    miss_distance_lunar: (missDistanceKm / lunarDistance).toFixed(2),
    velocity_kmh: velocityKmh,
    is_nasa_hazardous: neo.is_potentially_hazardous_asteroid,
  };
}

// Get risk assessment for all NEOs on a specific date
app.get("/neo/risk-assessment", async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const cacheKey = `neo-risk-assessment-${date}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Calculate risk for each NEO
      const riskAssessments = allNeos
        .map((neo) => ({
          id: neo.id,
          name: neo.name,
          ...calculateRiskScore(neo),
          approach_date:
            neo.close_approach_data[0]?.close_approach_date || date,
          nasa_url: neo.nasa_jpl_url,
        }))
        .sort((a, b) => b.risk_score - a.risk_score); // Sort by highest risk first

      // Summary statistics
      const riskSummary = {
        total_objects: riskAssessments.length,
        critical_risk: riskAssessments.filter(
          (neo) => neo.risk_level === "CRITICAL"
        ).length,
        high_risk: riskAssessments.filter(
          (neo) => neo.risk_level === "HIGH"
        ).length,
        moderate_risk: riskAssessments.filter(
          (neo) => neo.risk_level === "MODERATE"
        ).length,
        low_risk: riskAssessments.filter((neo) => neo.risk_level === "LOW")
          .length,
        minimal_risk: riskAssessments.filter(
          (neo) => neo.risk_level === "MINIMAL"
        ).length,
        highest_risk_score: riskAssessments[0]?.risk_score || 0,
        average_risk_score: (
          riskAssessments.reduce((sum, neo) => sum + neo.risk_score, 0) /
          riskAssessments.length
        ).toFixed(1),
      };

      return {
        date,
        risk_summary: riskSummary,
        risk_assessments: riskAssessments,
        algorithm_info: {
          max_score: 100,
          factors: [
            "Size/Diameter (0-40 points)",
            "Miss Distance (0-25 points)",
            "Velocity (0-20 points)",
            "NASA Hazardous Flag (0-10 points)",
            "Approach Frequency (0-5 points)",
          ],
          risk_levels: {
            CRITICAL: "80-100 points",
            HIGH: "60-79 points",
            MODERATE: "40-59 points",
            LOW: "20-39 points",
            MINIMAL: "0-19 points",
          },
        },
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating risk assessment:", error);
    res.status(500).json({ error: "Failed to generate risk assessment" });
  }
});

app.get("/neo/risk-assessment/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const cacheKey = `neo-risk-assessment-${date}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Calculate risk for each NEO
      const riskAssessments = allNeos
        .map((neo) => ({
          id: neo.id,
          name: neo.name,
          ...calculateRiskScore(neo),
          approach_date:
            neo.close_approach_data[0]?.close_approach_date || date,
          nasa_url: neo.nasa_jpl_url,
        }))
        .sort((a, b) => b.risk_score - a.risk_score);

      // Summary statistics
      const riskSummary = {
        total_objects: riskAssessments.length,
        critical_risk: riskAssessments.filter(
          (neo) => neo.risk_level === "CRITICAL"
        ).length,
        high_risk: riskAssessments.filter(
          (neo) => neo.risk_level === "HIGH"
        ).length,
        moderate_risk: riskAssessments.filter(
          (neo) => neo.risk_level === "MODERATE"
        ).length,
        low_risk: riskAssessments.filter((neo) => neo.risk_level === "LOW")
          .length,
        minimal_risk: riskAssessments.filter(
          (neo) => neo.risk_level === "MINIMAL"
        ).length,
        highest_risk_score: riskAssessments[0]?.risk_score || 0,
        average_risk_score: (
          riskAssessments.reduce((sum, neo) => sum + neo.risk_score, 0) /
          riskAssessments.length
        ).toFixed(1),
      };

      return {
        date,
        risk_summary: riskSummary,
        risk_assessments: riskAssessments,
        algorithm_info: {
          max_score: 100,
          factors: [
            "Size/Diameter (0-40 points)",
            "Miss Distance (0-25 points)",
            "Velocity (0-20 points)",
            "NASA Hazardous Flag (0-10 points)",
            "Approach Frequency (0-5 points)",
          ],
          risk_levels: {
            CRITICAL: "80-100 points",
            HIGH: "60-79 points",
            MODERATE: "40-59 points",
            LOW: "20-39 points",
            MINIMAL: "0-19 points",
          },
        },
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating risk assessment:", error);
    res.status(500).json({ error: "Failed to generate risk assessment" });
  }
});

// Get top 10 highest risk NEOs for a date range
app.get("/neo/highest-risk", async (req, res) => {
  try {
    const { start_date, end_date, limit = 10 } = req.query;
    const startDate = start_date || new Date().toISOString().split("T")[0];
    const endDate = end_date || startDate;

    const cacheKey = `neo-highest-risk-${startDate}-${endDate}-${limit}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Calculate risk and get top highest risk NEOs
      const highestRiskNeos = allNeos
        .map((neo) => ({
          id: neo.id,
          name: neo.name,
          ...calculateRiskScore(neo),
          approach_date: neo.close_approach_data[0]?.close_approach_date,
          nasa_url: neo.nasa_jpl_url,
        }))
        .sort((a, b) => b.risk_score - a.risk_score)
        .slice(0, parseInt(limit));

      return {
        date_range: { start_date: startDate, end_date: endDate },
        limit: parseInt(limit),
        highest_risk_neos: highestRiskNeos,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching highest risk NEOs:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch highest risk NEO data" });
  }
});

app.get("/neo/simple", async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const cacheKey = `neo-simple-${date}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Simplified format for tables/cards
      const simplifiedNeos = allNeos.map((neo) => ({
        id: neo.id,
        name: neo.name,
        diameter_km:
          neo.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(
            3
          ) || "Unknown",
        distance_km: parseFloat(
          neo.close_approach_data[0]?.miss_distance?.kilometers || 0
        ).toLocaleString(),
        velocity_kmh: parseFloat(
          neo.close_approach_data[0]?.relative_velocity
            ?.kilometers_per_hour || 0
        ).toLocaleString(),
        is_hazardous: neo.is_potentially_hazardous_asteroid,
        approach_date:
          neo.close_approach_data[0]?.close_approach_date || date,
        nasa_url: neo.nasa_jpl_url,
      }));

      return {
        date,
        neos: simplifiedNeos,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating simplified NEO data:", error);
    res
      .status(500)
      .json({ error: "Failed to generate simplified NEO data" });
  }
});

app.get("/neo/simple/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const cacheKey = `neo-simple-${date}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${api_key}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat();

      // Simplified format for tables/cards
      const simplifiedNeos = allNeos.map((neo) => ({
        id: neo.id,
        name: neo.name,
        diameter_km:
          neo.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(
            3
          ) || "Unknown",
        distance_km: parseFloat(
          neo.close_approach_data[0]?.miss_distance?.kilometers || 0
        ).toLocaleString(),
        velocity_kmh: parseFloat(
          neo.close_approach_data[0]?.relative_velocity
            ?.kilometers_per_hour || 0
        ).toLocaleString(),
        is_hazardous: neo.is_potentially_hazardous_asteroid,
        approach_date:
          neo.close_approach_data[0]?.close_approach_date || date,
        nasa_url: neo.nasa_jpl_url,
      }));

      return {
        date,
        neos: simplifiedNeos,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error generating simplified NEO data:", error);
    res
      .status(500)
      .json({ error: "Failed to generate simplified NEO data" });
  }
});

// Get detailed info about a specific NEO by ID
app.get("/neo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `neo-details-${id}`;
    const data = await getCachedOrFetch(cacheKey, async () => {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${api_key}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          const error = new Error("Near Earth Object not found");
          error.status = 404;
          throw error;
        }
        throw new Error(`NASA API error: ${response.status}`);
      }
      return await response.json();
    });
    res.json(data);
  } catch (error) {
    console.error("Error fetching NEO by ID:", error);
    if (error.status === 404) {
      res.status(404).json({ error: "Near Earth Object not found" });
    } else {
      res.status(500).json({ error: "Failed to fetch NEO data" });
    }
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Cache enabled with 15-minute TTL`);
  console.log(`GET /cache/stats - View cache statistics`);
  console.log(`DELETE /cache/clear - Clear all cache (dev only)`);
});
