import { Header } from '../components/Header.tsx';
import { SmallCard } from '../components/SmallCard.tsx';
import { getWalletInformation } from '../utils/wallet.ts';
import { useEffect, useState } from 'react';
import { WalletInformation } from '../services/scroll/types.ts';
import { TokenCard } from '../components/TokenCard.tsx';
import { ActivityCard } from '../components/ActivityCard.tsx';
import { ProtocolsCard } from '../components/ProtocolsCard.tsx';
import { AddressCard } from '../components/AddressCard.tsx';

const isValidateAddress = (address: string) => {
  return address !== '' && address.length === 42 && address.startsWith('0x');
};

export const Address = () => {
  const address = window.location.search.split('=')[1];

  document.title = 'ScrollFlow | ' + address.slice(0, 6) + '...' + address.slice(-4);

  const [wallet, setWallet] = useState<WalletInformation | null>(null);
  const [searchWallet, setSearchWallet] = useState<string>('');

  useEffect(() => {
    if (isValidateAddress(address)) {
      getWalletInformation(address).then((data) => {
        setWallet(data);
      });
    }
  }, []);

  return (
    <>
      <Header />
      {isValidateAddress(address) ? (
        <div className="z-0 grid mt-24 place-items-center">
          <div>
            <div className="relative mb-4 mt-1">
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
                onChange={(e) => {
                  setSearchWallet(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  window.location.href = '/scroll-flow?address=' + searchWallet;
                }}
                className="text-black absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-orange-200 hover:bg-orange-300 focus:ring-orange-200"
              >
                Search
              </button>
            </div>
            <AddressCard address={address} />

            <div className="flex items-center flex-row space-x-5 mt-5">
              <SmallCard
                title={'Interactions'}
                value={wallet?.interactions.toString()}
                change={wallet?.interactionsChange.toString()}
                loading={wallet === null}
              />
              <SmallCard
                title={'Volume'}
                value={'$' + wallet?.volume.toFixed(0)}
                change={'$' + wallet?.volumeChange.toFixed(0)}
                loading={wallet === null}
              />
              <SmallCard
                title={'Fee spent'}
                value={'$' + wallet?.fees.toFixed(1)}
                change={'$' + wallet?.feesChange.toFixed(1)}
                loading={wallet === null}
              />
            </div>
            <div className="flex items-center flex-row space-x-5 mt-1.5">
              <TokenCard tokens={wallet?.token} />
              <ActivityCard wallet={wallet} />
            </div>
            <ProtocolsCard wallet={wallet} />
          </div>
        </div>
      ) : (
        <div className="w-full text-center mt-80 text-black-500 text-3xl">Invalid address</div>
      )}
    </>
  );
};
