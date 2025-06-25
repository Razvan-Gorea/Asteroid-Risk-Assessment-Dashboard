import { config } from "dotenv";
config({ path: "../../.env.local" });

const { neoService, neoSummaryService, neoChartsService, neoRiskService } =
  await import("./client.js");

// Test all endpoints locally
// Just run node test_api.js
async function testAllEndpoints() {
  console.log("Testing All Local API Endpoints");
  console.log("Using base URL:", neoService.api.baseURL);

  const results = {
    passed: 0,
    failed: 0,
    errors: [],
  };

  // Helper function to test an endpoint
  async function testEndpoint(name, testFunction) {
    try {
      console.log(`Testing: ${name}`);
      const startTime = Date.now();
      const result = await testFunction();
      const duration = Date.now() - startTime;

      console.log(`${name} - SUCCESS (${duration}ms)`);
      console.log(`   Response keys: [${Object.keys(result).join(", ")}]`);
      if (result.element_count)
        console.log(`   Element count: ${result.element_count}`);
      if (result.total_count)
        console.log(`   Total count: ${result.total_count}`);
      if (result.date) console.log(`   Date: ${result.date}`);
      console.log("");

      results.passed++;
      return result;
    } catch (error) {
      console.error(`${name} - FAILED`);
      console.error(`   Error: ${error.message}`);
      console.log("");

      results.failed++;
      results.errors.push({ endpoint: name, error: error.message });
    }
  }

  // Get today's date for testing
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  console.log("BASIC NEO DATA ENDPOINTS");

  await testEndpoint("GET /neo/today", () => neoService.getNeoToday());

  await testEndpoint("GET /neo/feed (date range)", () =>
    neoService.getNeoFeed(yesterday, today)
  );

  await testEndpoint("GET /neo/hazardous (default)", () =>
    neoService.getHazardousNeos()
  );

  await testEndpoint("GET /neo/hazardous (with dates)", () =>
    neoService.getHazardousNeos(yesterday, today)
  );

  await testEndpoint("GET /neo/stats", () => neoService.getNeoStats());

  await testEndpoint("GET /neo/closest", () => neoService.getClosestNeos());

  await testEndpoint("GET /neo/largest", () => neoService.getLargestNeos());

  // Test specific NEO by ID (we'll get an ID from the today results)
  try {
    const todayResult = await neoService.getNeoToday();
    const firstNeo = Object.values(todayResult.near_earth_objects)[0]?.[0];
    if (firstNeo?.id) {
      await testEndpoint(`GET /neo/${firstNeo.id} (by ID)`, () =>
        neoService.getNeoById(firstNeo.id)
      );
    }
  } catch (error) {
    console.log("Could not test NEO by ID - no NEO data available");
  }

  console.log("\nSUMMARY DATA ENDPOINTS");

  await testEndpoint("GET /neo/summary (today)", () =>
    neoSummaryService.getNeoSummary()
  );

  await testEndpoint(`GET /neo/summary/${yesterday} (by date)`, () =>
    neoSummaryService.getNeoSummaryByDate(yesterday)
  );

  await testEndpoint("GET /neo/simple (today)", () =>
    neoSummaryService.getSimpleNeos()
  );

  await testEndpoint(`GET /neo/simple/${yesterday} (by date)`, () =>
    neoSummaryService.getSimpleNeosByDate(yesterday)
  );

  console.log("\nCHART DATA ENDPOINTS");

  await testEndpoint("GET /neo/charts/size-distribution (today)", () =>
    neoChartsService.getSizeDistribution()
  );

  await testEndpoint(
    `GET /neo/charts/size-distribution/${yesterday} (by date)`,
    () => neoChartsService.getSizeDistributionByDate(yesterday)
  );

  await testEndpoint("GET /neo/charts/distance-size (today)", () =>
    neoChartsService.getDistanceSize()
  );

  await testEndpoint(
    `GET /neo/charts/distance-size/${yesterday} (by date)`,
    () => neoChartsService.getDistanceSizeByDate(yesterday)
  );

  await testEndpoint("GET /neo/charts/timeline (7 days)", () =>
    neoChartsService.getTimeline(7)
  );

  await testEndpoint("GET /neo/charts/timeline (3 days)", () =>
    neoChartsService.getTimeline(3)
  );

  console.log("\nRISK ASSESSMENT ENDPOINTS");

  await testEndpoint("GET /neo/risk-assessment (today)", () =>
    neoRiskService.getRiskAssessment()
  );

  await testEndpoint(`GET /neo/risk-assessment/${yesterday} (by date)`, () =>
    neoRiskService.getRiskAssessmentByDate(yesterday)
  );

  await testEndpoint("GET /neo/highest-risk (default)", () =>
    neoRiskService.getHighestRiskNeos()
  );

  await testEndpoint("GET /neo/highest-risk (with params)", () =>
    neoRiskService.getHighestRiskNeos(yesterday, today, 5)
  );

  // Final summary
  console.log("\nTEST SUMMARY");
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(
    `Success Rate: ${(
      (results.passed / (results.passed + results.failed)) *
      100
    ).toFixed(1)}%`
  );

  if (results.errors.length > 0) {
    console.log("\nFAILED ENDPOINTS:");
    results.errors.forEach(({ endpoint, error }) => {
      console.log(`   • ${endpoint}: ${error}`);
    });
  }

  console.log(`\nBase URL used: ${neoService.api.baseURL}`);
  console.log("Test completed!");
}

testAllEndpoints();
