import { useState } from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border border-blue-200 rounded-lg mb-6 shadow">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
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
              className="text-white"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M21 3l-5 9h5l-6.891 7.086a6.5 6.5 0 1 1 -8.855 -9.506l7.746 -6.58l-1 5l9 -5z" />
              <path
                d="M9.5 14.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="self-center text-xl font-bold text-gray-900">
            Asteroid Risk Assessment Dashboard
          </span>
        </Link>

        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
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

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-blue-200 rounded-lg bg-blue-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white bg-blue-500 rounded md:bg-transparent md:text-blue-500 md:p-0 font-medium"
              >
                Risk Assessment
              </Link>
            </li>
            <li>
              <Link
                to="/visualizations"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0"
              >
                Visualizations
              </Link>
            </li>
            <li>
              <Link
                to="/individual-neo"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0"
              >
                Individual Neo
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
