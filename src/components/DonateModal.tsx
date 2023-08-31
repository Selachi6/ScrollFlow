import { useState } from 'react';

export const DonateModal = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      {showModal && (
        <div
          id="sticky-banner"
          className="fixed bottom-0 left-0 z-50 flex justify-between w-full p-4 border-b bg-gray-700 border-gray-600"
        >
          <div className="flex items-center mx-auto">
            <p className="flex items-center text-sm font-normal text-gray-400">
              <span className="inline-flex p-1 mr-3 rounded-full bg-gray-600">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"></path>
                </svg>
                <span className="sr-only">Light bulb</span>
              </span>
              <div>
                <div>
                  <span>If you want to tip me a beer for my work (or make one more transaction) you can on</span>
                  <span
                    onClick={() =>
                      window.open(
                        'https://explorer.zksync.io/address/0xF859dE92A63070C54d05E33a4e99D707a34FDb12',
                        '_blank',
                      )
                    }
                    className="text-white font-bold whitespace-pre-wrap cursor-pointer"
                  >
                    {' '}
                    0xF859dE92A63070C54d05E33a4e99D707a34FDb12
                  </span>
                </div>
                <div>
                  <span>You can also support me by using my referral code on goal3:</span>
                  <span
                    onClick={() => window.open('https://beta.goal3.xyz?r=zkflow', '_blank')}
                    className="text-white font-bold whitespace-pre-wrap cursor-pointer"
                  >
                    {' '}
                    zkflow
                  </span>
                </div>
              </div>
            </p>
          </div>
          <div className="flex items-center">
            <button
              data-dismiss-target="#sticky-banner"
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-shrink-0 inline-flex justify-center items-center text-gray-400 rounded-lg text-sm p-1.5 hover:bg-gray-600 hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close banner</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
