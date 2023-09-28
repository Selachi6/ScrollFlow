import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../services/redux/hooks.ts';
import { addWallet, removeWallet } from '../services/redux/walletsSlice.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const Wallet: FC<{ address: string }> = ({ address }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex mb-2">
      <h1 className="mt-2">{address.slice(0, 10) + '...........' + address.slice(-10)}</h1>
      <div
        className="ml-2 mt-2 cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(address);
        }}
      >
        <FontAwesomeIcon icon={faCopy} color={'white'} size={'lg'} />
      </div>
      <button
        className="ml-14 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        onClick={() => {
          dispatch(removeWallet(address));
        }}
      >
        Delete
      </button>
    </div>
  );
};

export const WalletModal: FC<{ setWalletModal: Dispatch<SetStateAction<boolean>> }> = ({ setWalletModal }) => {
  const wallets = useAppSelector((state) => state.wallets.wallets) || [];
  const dispatch = useAppDispatch();

  const [newWallet, setNewWallet] = useState('');

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-hidden h-[calc(100%)] max-h-full bg-black/[.3]">
      <div className="relative w-full max-w-md h-full ml-auto mr-auto mt-52">
        <div className="relative rounded-lg shadow bg-gray-700">
          <button
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
            onClick={() => {
              setWalletModal(false);
            }}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-white">Add/remove a wallet</h3>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-white">New wallet</label>
                <input
                  type="text"
                  name="text"
                  id="text"
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                  placeholder="0x0000....0000"
                  required
                  onChange={(e) => {
                    setNewWallet(e.target.value);
                  }}
                  value={newWallet}
                />
              </div>
              <button
                className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                onClick={() => {
                  if (newWallet.length < 40) return;
                  const newWallets = newWallet.split(',');

                  newWallets.forEach((wallet) => {
                    dispatch(addWallet({ name: 'Wallet', address: wallet }));
                  });
                  setNewWallet('');
                }}
              >
                Add
              </button>
            </div>
            <div className="mt-6 h-52 overflow-y-auto scrollbar text-white">
              {wallets.map((wallet: { name: string; address: string }) => {
                return <Wallet address={wallet.address} key={wallet.address} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
