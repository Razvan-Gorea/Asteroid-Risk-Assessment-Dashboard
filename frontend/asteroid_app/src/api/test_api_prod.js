// Test against production API
process.env.VITE_API_BASE_URL = 'https://asteroid-dashboard-backend.onrender.com/';

const { neoService } = await import('./client.js');

async function testProduction() {
  try {
    console.log('Testing production API...');
    const result = await neoService.getNeoToday();
    console.log('Production API works!');
    console.log('Sample data:', Object.keys(result));
  } catch (error) {
    console.error('Production API failed:', error.message);
  }
}

testProduction();