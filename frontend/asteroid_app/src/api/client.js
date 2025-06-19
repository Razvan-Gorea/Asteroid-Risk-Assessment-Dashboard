// api/client.js - Complete API client for all NEO endpoints
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint, params = {}, headers = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET', headers });
  }


}

// Service classes for different API endpoints

// Basic NEO data endpoints
class NeoService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  /**
   * Get Near Earth Objects for today
   * @returns {Promise} NEO data for today
   */
  getNeoToday() {
    return this.api.get('/neo/today');
  }

  /**
   * Get Near Earth Objects for a date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Promise} NEO feed data
   */
  getNeoFeed(startDate, endDate) {
    return this.api.get('/neo/feed', {
      start_date: startDate,
      end_date: endDate
    });
  }

  /**
   * Get only potentially hazardous asteroids for a date range
   * @param {string} startDate - Start date (optional, defaults to today)
   * @param {string} endDate - End date (optional, defaults to startDate)
   * @returns {Promise} Hazardous NEO data
   */
  getHazardousNeos(startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return this.api.get('/neo/hazardous', params);
  }

  /**
   * Get NEO statistics and summary from NASA
   * @returns {Promise} NEO statistics
   */
  getNeoStats() {
    return this.api.get('/neo/stats');
  }

  /**
   * Get closest approaching NEOs for today
   * @returns {Promise} Closest NEO data
   */
  getClosestNeos() {
    return this.api.get('/neo/closest');
  }

  /**
   * Get largest NEOs by estimated diameter for today
   * @returns {Promise} Largest NEO data
   */
  getLargestNeos() {
    return this.api.get('/neo/largest');
  }

  /**
   * Get detailed info about a specific NEO by ID
   * @param {string} id - NEO ID
   * @returns {Promise} Detailed NEO data
   */
  getNeoById(id) {
    return this.api.get(`/neo/${id}`);
  }
}

// Summary and simplified data endpoints
class NeoSummaryService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  /**
   * Get NEO summary with key metrics for today
   * @returns {Promise} NEO summary for today
   */
  getNeoSummary() {
    return this.api.get('/neo/summary');
  }

  /**
   * Get NEO summary with key metrics for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} NEO summary for date
   */
  getNeoSummaryByDate(date) {
    return this.api.get(`/neo/summary/${date}`);
  }

  /**
   * Get simplified NEO data for today (good for tables/cards)
   * @returns {Promise} Simplified NEO data
   */
  getSimpleNeos() {
    return this.api.get('/neo/simple');
  }

  /**
   * Get simplified NEO data for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} Simplified NEO data for date
   */
  getSimpleNeosByDate(date) {
    return this.api.get(`/neo/simple/${date}`);
  }
}

// Chart and visualization data endpoints
class NeoChartsService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  /**
   * Get chart-ready data for size distribution for today
   * @returns {Promise} Size distribution chart data
   */
  getSizeDistribution() {
    return this.api.get('/neo/charts/size-distribution');
  }

  /**
   * Get chart-ready data for size distribution for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} Size distribution chart data
   */
  getSizeDistributionByDate(date) {
    return this.api.get(`/neo/charts/size-distribution/${date}`);
  }

  /**
   * Get chart-ready data for distance vs size scatter plot for today
   * @returns {Promise} Distance vs size scatter plot data
   */
  getDistanceSize() {
    return this.api.get('/neo/charts/distance-size');
  }

  /**
   * Get chart-ready data for distance vs size scatter plot for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} Distance vs size scatter plot data
   */
  getDistanceSizeByDate(date) {
    return this.api.get(`/neo/charts/distance-size/${date}`);
  }

  /**
   * Get time series data for multiple dates
   * @param {number} days - Number of days to include (default: 7)
   * @returns {Promise} Timeline chart data
   */
  getTimeline(days = 7) {
    return this.api.get('/neo/charts/timeline', { days });
  }
}

// Risk assessment endpoints
class NeoRiskService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  /**
   * Get risk assessment for all NEOs for today
   * @returns {Promise} Risk assessment data
   */
  getRiskAssessment() {
    return this.api.get('/neo/risk-assessment');
  }

  /**
   * Get risk assessment for all NEOs for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} Risk assessment data
   */
  getRiskAssessmentByDate(date) {
    return this.api.get(`/neo/risk-assessment/${date}`);
  }

  /**
   * Get top highest risk NEOs for a date range
   * @param {string} startDate - Start date (optional, defaults to today)
   * @param {string} endDate - End date (optional, defaults to startDate)
   * @param {number} limit - Number of results to return (default: 10)
   * @returns {Promise} Highest risk NEO data
   */
  getHighestRiskNeos(startDate, endDate, limit = 10) {
    const params = { limit };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return this.api.get('/neo/highest-risk', params);
  }
}



// Main API instance and service exports
const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
);

export const neoService = new NeoService(apiClient);
export const neoSummaryService = new NeoSummaryService(apiClient);
export const neoChartsService = new NeoChartsService(apiClient);
export const neoRiskService = new NeoRiskService(apiClient);

// Export the client for custom usage
export { ApiClient };

// Export a unified service object for convenience
export const neoAPI = {
  // Basic NEO data
  today: () => neoService.getNeoToday(),
  feed: (startDate, endDate) => neoService.getNeoFeed(startDate, endDate),
  hazardous: (startDate, endDate) => neoService.getHazardousNeos(startDate, endDate),
  stats: () => neoService.getNeoStats(),
  closest: () => neoService.getClosestNeos(),
  largest: () => neoService.getLargestNeos(),
  byId: (id) => neoService.getNeoById(id),
  
  // Summary data
  summary: () => neoSummaryService.getNeoSummary(),
  summaryByDate: (date) => neoSummaryService.getNeoSummaryByDate(date),
  simple: () => neoSummaryService.getSimpleNeos(),
  simpleByDate: (date) => neoSummaryService.getSimpleNeosByDate(date),
  
  // Chart data
  sizeDistribution: () => neoChartsService.getSizeDistribution(),
  sizeDistributionByDate: (date) => neoChartsService.getSizeDistributionByDate(date),
  distanceSize: () => neoChartsService.getDistanceSize(),
  distanceSizeByDate: (date) => neoChartsService.getDistanceSizeByDate(date),
  timeline: (days) => neoChartsService.getTimeline(days),
  
  // Risk assessment
  riskAssessment: () => neoRiskService.getRiskAssessment(),
  riskAssessmentByDate: (date) => neoRiskService.getRiskAssessmentByDate(date),
  highestRisk: (startDate, endDate, limit) => neoRiskService.getHighestRiskNeos(startDate, endDate, limit)
};