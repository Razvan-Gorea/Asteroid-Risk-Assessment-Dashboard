import { config } from 'dotenv';
config({ path: '../../.env.local' });

const { neoService, neoSummaryService, neoChartsService, neoRiskService } = await import('./client.js');

// Test the endpoints locally
// Just run node test_api.js
async function runTests() {
  try {
    console.log('Testing Today NEOs:');
    const today = await neoService.getNeoToday();
    console.log(JSON.stringify(today, null, 2));
    
    console.log('\nTesting NEO Stats:');
    const stats = await neoService.getNeoStats();
    console.log(JSON.stringify(stats, null, 2));
    
    console.log('\nTesting Summary:');
    const summary = await neoSummaryService.getNeoSummary();
    console.log(JSON.stringify(summary, null, 2));
    
    console.log('\nTesting Simple NEOs:');
    const simple = await neoSummaryService.getSimpleNeos();
    console.log(JSON.stringify(simple, null, 2));
    
    console.log('\nTesting Size Distribution:');
    const sizeDistribution = await neoChartsService.getSizeDistribution();
    console.log(JSON.stringify(sizeDistribution, null, 2));
    
    console.log('\nTesting Risk Assessment:');
    const risk = await neoRiskService.getRiskAssessment();
    console.log(JSON.stringify(risk, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runTests();