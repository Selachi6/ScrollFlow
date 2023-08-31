import { countTransactionPeriods } from '../utils/utils.ts';
import { Protocol } from '../services/era-explorer/types.ts';
import { Transaction } from '../services/era-explorer/era-explorer.ts';

const addresses: string[] = [
  '0x7642e38867860d4512fcce1116e2fb539c5cdd21',
  '0xf100ff84b363af74e3fcdff554e3da3309159458',
  '0x4eaaab540065b4e404d79fe1f0bf3a9c046f9151',
  '0x6f89797fe9c97e57a1137fa70caa69f8abbfff50',
  '0x18381c0f738146fb694de18d1106bde2be040fa4',
];

export const ZkSwap = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'ZkSwap',
      id: 'zkSwap',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      activeMonths: 0,
      activeWeeks: 0,
      url: 'https://zkswap.finance/',
    };

    transactions.forEach((transaction: Transaction) => {
      if (addresses.includes(transaction.to.toLowerCase())) {
        if (protocolState.lastActivity === '') protocolState.lastActivity = transaction.receivedAt;
        if (new Date(protocolState.lastActivity) < new Date(transaction.receivedAt))
          protocolState.lastActivity = transaction.receivedAt;
        protocolState.interactions += 1;

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
