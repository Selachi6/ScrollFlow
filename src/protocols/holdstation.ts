import { countTransactionPeriods } from '../utils/utils.ts';
import { AbiCoder, ethers, formatUnits } from 'ethers';
import { Protocol } from '../services/era-explorer/types.ts';
import { Transaction } from '../services/era-explorer/era-explorer.ts';

const addresses: string[] = [
  '0x7b4872e2096ec9410b6b8c8b7d039589e6ee8022',
  '0xaf08a9d918f16332f22cf8dc9abe9d9e14ddcbc2',
  '0x51956481ced6f65458a25207e725cbd2e33a02cb',
  '0x19b1ae9fd718107da3bed1f39ed9b3a5adbe89c0',
];

export const Holdstation = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'Holdstation',
      id: 'holdstation',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      url: 'https://holdstation.exchange/',
      tag: 'Gasless',
      activeMonths: 0,
      activeWeeks: 0,
    };

    transactions.forEach((transaction: Transaction) => {
      if (addresses.includes(transaction.to.toLowerCase())) {
        if (protocolState.lastActivity === '') protocolState.lastActivity = transaction.receivedAt;
        if (new Date(protocolState.lastActivity) < new Date(transaction.receivedAt))
          protocolState.lastActivity = transaction.receivedAt;
        protocolState.interactions += 1;
        if (transaction.data.startsWith('0x9aa7c0e5')) {
          const data = AbiCoder.defaultAbiCoder().decode(
            [
              'address',
              'uint256',
              'uint256',
              'uint256',
              'uint256',
              'uint256',
              'bool',
              'uint256',
              'uint256',
              'uint256',
              'uint8',
              'uint256',
              'uint256',
              'address',
            ],
            ethers.dataSlice(transaction.data, 4),
          );
          const usdc = parseFloat(formatUnits(data[4], 6));
          const multiplier: number = parseInt(data[7]);
          protocolState.volume += usdc * multiplier;
          return;
        }

        const transfers = transaction.transfers.sort(
          (a, b) =>
            parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
            parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price,
        );

        if (transfers.length === 0) return;
        protocolState.volume +=
          parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * transfers[0].token.price;
      }
    });

    protocolState.activeDays = countTransactionPeriods(address, transactions, protocolState.id, addresses).days;

    protocolState.activeWeeks = countTransactionPeriods(address, transactions, protocolState.id, addresses).weeks;
    protocolState.activeMonths = countTransactionPeriods(address, transactions, protocolState.id, addresses).months;

    return protocolState;
  },
};
