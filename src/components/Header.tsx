import { useState } from 'react';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 border-gray-700 border-b fixed top-0 left-0 w-full z-10">
      <div className=" flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/zk-flow">
          <img src="/zk-flow/logo.png" className="h-12 mr-3" alt="zkFlow logo" />
        </a>

        <button
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
          aria-controls="navbar-solid-bg"
          aria-expanded="false"
          onClick={() => setMenuOpen(!menuOpen)}
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
        <div className="w-full md:block md:w-auto hidden" id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-800 md:bg-transparent border-gray-700">
            <li>
              <a
                href="/zk-flow"
                className={
                  'block py-2 pl-3 pr-4 rounded md:p-0 bg-blue-600 md:bg-transparent ' +
                  (!window.location.search ? 'text-blue-500' : 'text-white')
                }
              >
                Search
              </a>
            </li>
            <li>
              <a
                href="?overview=true"
                className={
                  'block py-2 pl-3 pr-4 rounded md:p-0 bg-blue-600 md:bg-transparent ' +
                  (window.location.search.includes('overview') ? 'text-blue-500' : 'text-white')
                }
              >
                Overview
              </a>
            </li>
          </ul>
        </div>
      </div>
      {menuOpen && (
        <ul className="border-t md:hidden p-4 flex flex-col font-medium mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-800 md:bg-transparent border-gray-700">
          <li>
            <a
              href="/zk-flow"
              className={
                !window.location.search
                  ? 'block mb-2 py-2 pl-3 pr-4 text-white rounded md:p-0 md:text-blue-500 bg-blue-600 md:bg-transparent'
                  : 'block py-2 pl-3 pr-4 rounded md:border-0 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent'
              }
            >
              Search
            </a>
          </li>
          <li>
            <a
              href="?overview=true"
              className={
                window.location.search.includes('overview')
                  ? 'block mt-2 py-2 pl-3 pr-4 text-white rounded md:p-0 md:text-blue-500 bg-blue-600 md:bg-transparent'
                  : 'block py-2 pl-3 pr-4 rounded md:border-0 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent'
              }
            >
              Overview
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};
