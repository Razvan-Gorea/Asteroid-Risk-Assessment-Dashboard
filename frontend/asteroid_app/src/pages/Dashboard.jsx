function Dashboard(){
    return (
    <div className="min-h-screen bg-blue-50 p-4">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 rounded-lg mb-6">
        <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold 
                       leading-tight sm:leading-snug md:leading-normal">
          Asteriod Risk Assessment Dashboard
        </h1>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
          <h3 className="text-blue-500 text-sm font-medium">Placeholder</h3>
          <p className="text-gray-900 text-2xl font-bold mt-2">Placeholder</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
          <h3 className="text-blue-500 text-sm font-medium">Placeholder</h3>
          <p className="text-gray-900 text-2xl font-bold mt-2">Placeholder</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
          <h3 className="text-blue-500 text-sm font-medium">Placeholder</h3>
          <p className="text-gray-900 text-2xl font-bold mt-2">Placeholder</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 
