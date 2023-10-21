import { FC } from 'react';
import { WalletInformation } from '../services/scroll/types.ts';
import { getTimeAgo } from '../utils/utils.ts';

export const ProtocolsCard: FC<{ wallet: WalletInformation | null }> = ({ wallet }) => {
  return (
    <div className="relative mt-1.5 rounded-lg border-gray-700 border mb-20">
      <table className="text-sm w-[812px] text-left text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-white bg-gray-800 rounded-t-lg">
          Protocols
          <p className="mt-1 text-sm font-normal text-gray-400">Here is the list of protocols used by this address.</p>
          <p className="mt-1 text-sm font-normal text-gray-400">
            Note that it is the first version of ScrollFlow. If you find an issue, don't hesitate to report it to me on
            twitter (@Selachi667). Credits to @byfishh for the work !.
          </p>
        </caption>
        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Protocols
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Interactions
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Last activity
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Volume in $
            </th>
          </tr>
        </thead>
        {wallet ? (
          <tbody className="rounded-lg">
            {wallet.protocols &&
              wallet.protocols.map((protocolState, index) => {
                return (
                  <tr
                    className={'bg-gray-800 ' + (index !== wallet.protocols.length - 1 && 'border-b border-gray-700')}
                    key={protocolState.id}
                  >
                    <th scope="row" className="px-6 py-4 font-medium text-white cursor-pointer">
                      <div
                        className="flex items-center space-x-4"
                        onClick={() => {
                          window.open(protocolState.url, '_blank');
                        }}
                      >
                        <img
                          className={'w-10 h-10 rounded-full ' + (!protocolState.interactions && 'grayscale')}
                          src={'/scroll-flow/protocols/' + protocolState.id + '.png'}
                          alt=""
                        />
                        <div className="font-medium text-white">
                          <div className="flex">
                            {protocolState.name}
                            {protocolState.tag && (
                              <span className="ml-2 mb-1 text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-gray-700 text-green-400 border border-green-400">
                                {protocolState.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {protocolState.activeDays <= 1
                              ? protocolState.activeDays + ' active day'
                              : protocolState.activeDays + ' active days'}
                          </div>
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4 text-center font-medium text-white">{protocolState.interactions}</td>
                    <td className="px-6 py-4 text-center font-medium">
                      {!protocolState.lastActivity ? (
                        <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-gray-700 text-red-400 border border-red-400">
                          No activity
                        </span>
                      ) : new Date(protocolState.lastActivity).getTime() > new Date().getTime() - 86400000 * 7 ? (
                        <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-gray-700 text-green-400 border border-green-400">
                          {getTimeAgo(new Date(protocolState.lastActivity).getTime())}
                        </span>
                      ) : (
                        <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-gray-700 text-yellow-300 border border-yellow-300">
                          {getTimeAgo(new Date(protocolState.lastActivity).getTime())}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-white">{protocolState.volume.toFixed(2)}</td>
                  </tr>
                );
              })}
          </tbody>
        ) : (
          <tbody />
        )}
      </table>
    </div>
  );
};
