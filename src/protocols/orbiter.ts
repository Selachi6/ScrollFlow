import { countTransactionPeriods } from '../utils/utils.ts';
import { Transaction } from '../services/scroll/scroll.ts';
import { Protocol } from '../services/scroll/types.ts';

const addresses: string[] = [
  '0xe4edb277e41dc89ab076a1f049f4a3efa700bce8',
  '0x80c67432656d59144ceff962e8faf8926599bcf8',
  '0xee73323912a4e3772b74ed0ca1595a152b0ef282',
  '0x0a88BC5c32b684D467b43C06D9e0899EfEAF59Df',
];

export const Orbiter = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'Orbiter Finance',
      id: 'orbiter',
      lastActivity: 0,
      volume: 0,
      interactions: 0,
      activeDays: 0,
      url: 'https://orbiter.finance/',
      activeMonths: 0,
      activeWeeks: 0,
    };

    transactions.forEach((transaction: Transaction) => {
      if (addresses.includes(transaction.to.toLowerCase()) || addresses.includes(transaction.from.toLowerCase())) {
        if (protocolState.lastActivity == 0) protocolState.lastActivity = transaction.receivedAt;
        if (new Date(protocolState.lastActivity) < new Date(transaction.receivedAt))
          protocolState.lastActivity = transaction.receivedAt;
        protocolState.interactions += 1;

        const transfers = transaction.transfers.sort(
          (a, b) =>
            parseInt(b.value) * 10 ** -b.tokenDecimal * b.price -
            parseInt(a.value) * 10 ** -a.tokenDecimal * a.price,
        );

        if (transfers.length === 0) return;
        protocolState.volume +=
          parseInt(transfers[0].value) * 10 ** -transfers[0].tokenDecimal * transfers[0].price;
      }
    });

    protocolState.activeDays = countTransactionPeriods(address, transactions, protocolState.id).days;
    protocolState.activeWeeks = countTransactionPeriods(address, transactions, protocolState.id).weeks;
    protocolState.activeMonths = countTransactionPeriods(address, transactions, protocolState.id).months;
    return protocolState;
  },
};