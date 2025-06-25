import { useState, useEffect } from 'react';
import { neoService } from '../../api/client';

const Neo = () => {
  const [neoId, setNeoId] = useState('');
  const [selectedNeoId, setSelectedNeoId] = useState(null);
  const [neoData, setNeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (neoId.trim()) {
      setSelectedNeoId(neoId.trim());
    }
  };

  const handleClose = () => {
    setSelectedNeoId(null);
    setNeoData(null);
    setError(null);
    setNeoId('');
  };

  useEffect(() => {
    if (selectedNeoId) {
      fetchNeoDetails();
    }
  }, [selectedNeoId]);

  const fetchNeoDetails = async () => {
    if (!selectedNeoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await neoService.getNeoById(selectedNeoId);
      setNeoData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch NEO details');
      console.error('NEO fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (distance) => {
    return parseFloat(distance).toLocaleString();
  };

  const formatDiameter = (diameterObj) => {
    if (!diameterObj || !diameterObj.kilometers) return 'Unknown';
    const min = parseFloat(diameterObj.kilometers.estimated_diameter_min || 0).toFixed(2);
    const max = parseFloat(diameterObj.kilometers.estimated_diameter_max || 0).toFixed(2);
    return `${min} - ${max} km`;
  };

  const formatVelocity = (velocity) => {
    return parseFloat(velocity).toFixed(2);
  };

  // Show form when no NEO is selected
  if (!selectedNeoId) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow border border-blue-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-blue-200">
            <h2 className="text-xl font-bold text-gray-900">NEO Details Viewer</h2>
            <p className="text-sm text-blue-500 mt-1">Enter a Near Earth Object ID to view detailed information</p>
          </div>
          
          {/* Form Content */}
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="neoId" className="block text-blue-500 text-sm font-medium mb-2">
                NEO ID
              </label>
              <div className="flex gap-3">
                <input
                  id="neoId"
                  type="text"
                  value={neoId}
                  onChange={(e) => setNeoId(e.target.value)}
                  placeholder="Enter NEO ID (e.g., 2000433, 3542519)"
                  className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!neoId.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-blue-200 p-4">
              <h3 className="text-blue-500 font-medium mb-2">Try these example NEO IDs:</h3>
              <div className="flex flex-wrap gap-2">
                {['2000433', '3542519', '2001620', '2162038'].map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      setNeoId(id);
                      setSelectedNeoId(id);
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow border border-blue-200 p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow border border-blue-200 p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading NEO details
                </h3>
                <p className="mt-1 text-sm text-red-600">{error}</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={fetchNeoDetails}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={handleClose}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Back to Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show NEO details
  if (!neoData) {
    return null;
  }

  const neo = neoData;
  
  // Find the next future close approach
  const now = new Date();
  const futureApproaches = neo.close_approach_data?.filter(approach => {
    const approachDate = new Date(approach.close_approach_date);
    return approachDate > now;
  }) || [];
  
  // If no future approaches, use the most recent past approach
  const closeApproach = futureApproaches.length > 0 
    ? futureApproaches[0] // First future approach (they should be sorted)
    : neo.close_approach_data?.[0]; // Fallback to first approach

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow border border-blue-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{neo.name}</h2>
            <p className="text-sm text-blue-500">NEO Reference ID: {neo.id}</p>
          </div>
          <button
            onClick={handleClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back to Search
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
              <h3 className="text-blue-500 text-sm font-medium mb-2">Hazard Status</h3>
              <div className="flex items-center justify-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  neo.is_potentially_hazardous_asteroid ? 'bg-red-500' : 'bg-green-500'
                }`}></span>
                <span className={`text-sm font-medium ${
                  neo.is_potentially_hazardous_asteroid ? 'text-red-700' : 'text-green-700'
                }`}>
                  {neo.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Not Hazardous'}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
              <h3 className="text-blue-500 text-sm font-medium mb-2">Size Range</h3>
              <p className="text-gray-900 text-lg font-bold">{formatDiameter(neo.estimated_diameter)}</p>
              <p className="text-xs text-gray-600 mt-1">Estimated diameter</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
              <h3 className="text-blue-500 text-sm font-medium mb-2">Time to Orbit Sun</h3>
              <p className="text-gray-900 text-lg font-bold">
                {neo.orbital_data?.orbital_period ? 
                  `${parseFloat(neo.orbital_data.orbital_period).toFixed(1)} days` : 
                  'Unknown'
                }
              </p>
              <p className="text-xs text-gray-600 mt-1">One complete orbit</p>
            </div>
          </div>

          {/* Close Approach Data */}
          {closeApproach && (
            <div className="bg-white rounded-lg shadow border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {futureApproaches.length > 0 ? 'Next Close Approach' : 'Most Recent Close Approach'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                  <h4 className="text-blue-500 text-sm font-medium mb-2">Approach Date</h4>
                  <p className="text-gray-900 font-bold">{closeApproach.close_approach_date_full || closeApproach.close_approach_date}</p>
                  {futureApproaches.length > 0 ? (
                    <p className="text-xs text-green-600 mt-1">Future approach</p>
                  ) : (
                    <p className="text-xs text-gray-600 mt-1">Past approach</p>
                  )}
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                  <h4 className="text-blue-500 text-sm font-medium mb-2">Miss Distance</h4>
                  <p className="text-gray-900 font-bold">{formatDistance(closeApproach.miss_distance?.kilometers)} km</p>
                  <p className="text-xs text-gray-600 mt-1">{parseFloat(closeApproach.miss_distance?.lunar).toFixed(2)} lunar distances</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                  <h4 className="text-blue-500 text-sm font-medium mb-2">Approach Speed</h4>
                  <p className="text-gray-900 font-bold">{formatVelocity(closeApproach.relative_velocity?.kilometers_per_hour)} km/h</p>
                  <p className="text-xs text-gray-600 mt-1">Relative to {closeApproach.orbiting_body}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                  <h4 className="text-blue-500 text-sm font-medium mb-2">Approaching</h4>
                  <p className="text-gray-900 font-bold">{closeApproach.orbiting_body}</p>
                  <p className="text-xs text-gray-600 mt-1">Planet being approached</p>
                </div>
              </div>
            </div>
          )}

          {/* Physical Characteristics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Properties</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                  <h4 className="text-blue-500 text-sm font-medium mb-1">Absolute Magnitude</h4>
                  <p className="text-gray-900 font-bold">{neo.absolute_magnitude_h}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                  <h4 className="text-blue-500 text-sm font-medium mb-1">Diameter (km)</h4>
                  <p className="text-gray-900 font-bold">{formatDiameter(neo.estimated_diameter)}</p>
                </div>
                {neo.estimated_diameter?.meters && (
                  <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                    <h4 className="text-blue-500 text-sm font-medium mb-1">Diameter (m)</h4>
                    <p className="text-gray-900 font-bold">{formatDiameter(neo.estimated_diameter.meters)} m</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Classification</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                  <h4 className="text-blue-500 text-sm font-medium mb-1">NEO Reference ID</h4>
                  <p className="text-gray-900 font-bold">{neo.neo_reference_id}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
                  <h4 className="text-blue-500 text-sm font-medium mb-1">NASA JPL URL</h4>
                  <a 
                    href={neo.nasa_jpl_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    View on NASA JPL
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Orbital Data */}
          {neo.orbital_data && (
            <div className="bg-white rounded-lg shadow border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orbital Characteristics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {neo.orbital_data.orbital_period && (
                  <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                    <h4 className="text-blue-500 text-sm font-medium mb-2">Orbital Period</h4>
                    <p className="text-gray-900 font-bold">{parseFloat(neo.orbital_data.orbital_period).toFixed(1)} days</p>
                  </div>
                )}
                {neo.orbital_data.minimum_orbit_intersection && (
                  <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                    <h4 className="text-blue-500 text-sm font-medium mb-2">Min Orbit Intersection</h4>
                    <p className="text-gray-900 font-bold">{parseFloat(neo.orbital_data.minimum_orbit_intersection).toFixed(6)} AU</p>
                  </div>
                )}
                {neo.orbital_data.eccentricity && (
                  <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                    <h4 className="text-blue-500 text-sm font-medium mb-2">Eccentricity</h4>
                    <p className="text-gray-900 font-bold">{parseFloat(neo.orbital_data.eccentricity).toFixed(6)}</p>
                  </div>
                )}
                {neo.orbital_data.semi_major_axis && (
                  <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                    <h4 className="text-blue-500 text-sm font-medium mb-2">Semi-major Axis</h4>
                    <p className="text-gray-900 font-bold">{parseFloat(neo.orbital_data.semi_major_axis).toFixed(6)} AU</p>
                  </div>
                )}
                {neo.orbital_data.inclination && (
                  <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                    <h4 className="text-blue-500 text-sm font-medium mb-2">Inclination</h4>
                    <p className="text-gray-900 font-bold">{parseFloat(neo.orbital_data.inclination).toFixed(2)}°</p>
                  </div>
                )}
                {neo.orbital_data.ascending_node_longitude && (
                  <div className="bg-white p-4 rounded-lg shadow border border-blue-200 text-center">
                    <h4 className="text-blue-500 text-sm font-medium mb-2">Ascending Node</h4>
                    <p className="text-gray-900 font-bold">{parseFloat(neo.orbital_data.ascending_node_longitude).toFixed(2)}°</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Close Approaches */}
          {neo.close_approach_data && neo.close_approach_data.length > 1 && (
            <div className="bg-white rounded-lg shadow border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Recorded Close Approaches</h3>
              <p className="text-sm text-gray-600 mb-4">
                Historical and predicted close encounters with planets as this asteroid orbits the Sun
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="text-left py-3 px-4 text-blue-500 font-medium">Approach Date</th>
                      <th className="text-left py-3 px-4 text-blue-500 font-medium">Miss Distance (km)</th>
                      <th className="text-left py-3 px-4 text-blue-500 font-medium">Approach Speed (km/h)</th>
                      <th className="text-left py-3 px-4 text-blue-500 font-medium">Planet Approached</th>
                    </tr>
                  </thead>
                  <tbody>
                    {neo.close_approach_data.map((approach, index) => (
                      <tr key={index} className="border-b border-blue-100">
                        <td className="py-3 px-4 text-gray-900">{approach.close_approach_date}</td>
                        <td className="py-3 px-4 text-gray-900">{formatDistance(approach.miss_distance?.kilometers)}</td>
                        <td className="py-3 px-4 text-gray-900">{formatVelocity(approach.relative_velocity?.kilometers_per_hour)}</td>
                        <td className="py-3 px-4 text-gray-900">{approach.orbiting_body}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-blue-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <button
              onClick={fetchNeoDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Refresh Data
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Neo;