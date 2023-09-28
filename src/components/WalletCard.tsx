import { WalletInformation } from '../services/era-explorer/types.ts';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { getTimeAgo } from '../utils/utils.ts';

const Info: FC<{ title: string; value: string; change?: string }> = ({ title, value, change }) => (
  <div className="w-[100px]">
    <h3 className="text-l text-white">{title}</h3>
    <div className="text-center pt-1">
      <h3 className="mb-2 text-2xl font-extrabold text-blue-600">{value}</h3>
      {change && (
        <div>
          <div className={'text-l ' + (!change ? 'text-red-400' : 'text-green-400')}>+{change}</div>
          <div className="text-sm text-gray-400">the last 7 days</div>
        </div>
      )}
    </div>
  </div>
);
export const WalletCard = ({ wallet }: { wallet: WalletInformation }) => {
  return (
    <div className="mb-4 border mt-4 rounded-lg shadow-sm border-gray-700 p-6 bg-gray-800 w-[815px]">
      <div className="flex">
        <h1 className="mt-1 font-bold text-2xl text-white mb-5">
          {wallet.address.slice(0, 6) + '...' + wallet.address.slice(-4)}
        </h1>
        <div
          className="ml-2 mt-2 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(wallet.address);
          }}
        >
          <FontAwesomeIcon icon={faCopy} color={'white'} size={'lg'} />
        </div>
        <button
          className="w-30 h-10 ml-[500px] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4"
          onClick={() => {
            window.open('https://byfishh.github.io/zk-flow?address=' + wallet.address, '_blank')?.focus();
          }}
        >
          Details
        </button>
      </div>
      <div className="flex justify-between ml-10 mr-10 text-center">
        <Info title={'Interactions'} value={wallet.interactions.toString()} />
        <Info title={'Volume'} value={'$' + wallet.volume.toFixed(0)} />
        <Info title={'Fee spent'} value={'$' + wallet.fees.toFixed(1)} />
      </div>
      <div className="flex justify-between ml-10 mr-10 mt-5 text-center">
        <Info title={'Last activity'} value={wallet.lastActivity ? getTimeAgo(wallet.lastActivity) : 'Never'} />
        <Info title={'Active days'} value={wallet.activeDays.toString()} />
        <Info title={'Contracts'} value={wallet.interactedContracts.toString()} />
      </div>
      <div className="grid place-items-center mt-5 text-center">
        <Info title={'Balance'} value={'$' + wallet.balance.toFixed(2)} />
      </div>
    </div>
  );
};
