import { FC } from 'react';
import { Token } from '../services/scroll/scroll.ts';

export const TokenCard: FC<{ tokens: Token[] | undefined }> = ({ tokens }) => {
  return (
    <div className="mb-4  border rounded-lg shadow-sm 2xl:col-span-2 border-gray-700 p-6 bg-gray-800 h-[245px] overflow-auto overflow-x-hidden scrollbar">
      <div className="block space-x-4 w-[339px]">
        <ul className="max-w-md divide-y divide-gray-700">
          {!tokens && <h1 className="text-center text-2xl text-white mt-16">Impossible to load token</h1>}
          {tokens &&
            tokens.map((token, index) => {
              return (
                <li className={!index ? 'pb-4' : index === tokens.length - 1 ? 'pt-4' : 'pt-4 pb-4'} key={index}>
                  <div
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() => {
                      window.open('https://scrollscan.com/address/' + token.contractAddress, '_blank');
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex">
                        <p className="text-sm font-medium truncate text-white">{token.symbol}</p>
                        {token.type === 'ERC-721' && (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium rounded bg-gray-700 text-blue-400">
                            NFT
                          </span>
                        )}
                      </div>
                      <p className="text-sm truncate text-gray-400">{token.name}</p>
                    </div>
                    <div className="inline-flex flex-col items-end text-base font-semibold text-white">
                      <div>{token.decimals ? (token.balance * 10 ** -token.decimals).toFixed(3) : token.balance}</div>
                      {token.price !== undefined && (
                        <div className="text-xs text-gray-400">
                          ${((token.price || 0) * (token.balance * 10 ** -token.decimals)).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};
