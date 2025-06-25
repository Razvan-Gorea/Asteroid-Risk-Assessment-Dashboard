import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Checking if current route matches
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Link style classes based on active state
  const getLinkClasses = (path, baseClasses) => {
    const isActive = isActiveRoute(path);

    if (isActive) {
      return `${baseClasses} text-white bg-blue-500 rounded md:bg-transparent md:text-blue-500 font-medium`;
    }

    return `${baseClasses} text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 relative group`;
  };

  return (
    <nav className="bg-white border border-blue-200 rounded-lg mb-6 shadow transition-all duration-300 ease-out transform hover:shadow-lg hover:-translate-y-1">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Section with Fade In Left */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 ease-out transform group-hover:rotate-12 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white transition-transform duration-300 ease-out"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M21 3l-5 9h5l-6.891 7.086a6.5 6.5 0 1 1 -8.855 -9.506l7.746 -6.58l-1 5l9 -5z" />
              <path
                d="M9.5 14.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="self-center text-xl font-bold text-gray-900 transition-colors duration-300 ease-out group-hover:text-blue-600">
            Asteroid Risk Assessment Dashboard
          </span>
        </Link>

        {/* Mobile Menu Button with Animation */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-out transform hover:scale-110 active:scale-95"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className={`w-5 h-5 transition-transform duration-300 ease-out ${
              isMenuOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Navigation Menu with Slide Animation */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto transition-all duration-500 ease-out transform ${
            isMenuOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-4 opacity-0 md:translate-x-0 md:opacity-100"
          }`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-blue-200 rounded-lg bg-blue-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white transition-all duration-300 ease-out">
            {/* Risk Assessment Link */}
            <li className="transition-all duration-300 ease-out transform hover:-translate-y-1">
              <Link
                to="/"
                className={getLinkClasses(
                  "/",
                  "block py-2 px-3 md:p-0 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-md md:hover:shadow-none"
                )}
                style={{ animationDelay: "100ms" }}
              >
                Risk Assessment
                {!isActiveRoute("/") && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 ease-out group-hover:w-full md:block hidden"></span>
                )}
              </Link>
            </li>

            {/* Visualizations Link */}
            <li className="transition-all duration-300 ease-out transform hover:-translate-y-1">
              <Link
                to="/visualizations"
                className={getLinkClasses(
                  "/visualizations",
                  "block py-2 px-3 md:p-0 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-md md:hover:shadow-none"
                )}
                style={{ animationDelay: "200ms" }}
              >
                Visualizations
                {!isActiveRoute("/visualizations") && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 ease-out group-hover:w-full md:block hidden"></span>
                )}
              </Link>
            </li>

            {/* Individual Neo Link */}
            <li className="transition-all duration-300 ease-out transform hover:-translate-y-1">
              <Link
                to="/individual-neo"
                className={getLinkClasses(
                  "/individual-neo",
                  "block py-2 px-3 md:p-0 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-md md:hover:shadow-none"
                )}
                style={{ animationDelay: "300ms" }}
              >
                Individual Neo
                {!isActiveRoute("/individual-neo") && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 ease-out group-hover:w-full md:block hidden"></span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
