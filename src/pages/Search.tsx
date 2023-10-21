import { Header } from '../components/Header.tsx';
import { useState } from 'react';

export const Search = () => {
  const [address, setAddress] = useState<string>('');

  document.title = 'scrollFlow | Search';
  const handleSubmit = () => {
    if (address === '' || address.length !== 42 || !address.startsWith('0x')) {
      alert('Please enter valid address');
      return;
    }
    window.location.search = '?address=' + address;
  };

  return (
    <>
      <Header />
      <div className="grid mt-36 place-items-center">
        <div className="grid place-items-center">
          <h1 className="font-bold text-6xl text-black mb-10 ">ScrollFlow</h1>
          <p className="text-black font-light text-2xl text-center mr-4 ml-4 max-w-4xl">
            scrollFlow is a website where you can track your address and see how many volume you did on different Scroll
            protocols.
          </p>
          <div className="w-9/12 mt-20">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="outline-none block w-full p-4 pl-10 text-sm border rounded-lg bg-white bg-opacity-75 border-gray-600 placeholder-gray-400 text-black focus:ring-orange-500 focus:border-orange-500"
                placeholder="Search Address"
                required
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="text-black absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-orange-200 hover:bg-orange-300 focus:ring-orange-200"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
