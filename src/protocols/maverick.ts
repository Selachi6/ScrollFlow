import { countTransactionPeriods } from '../utils/utils.ts';
import { Protocol } from '../services/era-explorer/types.ts';
import { Transaction } from '../services/era-explorer/era-explorer.ts';

const addresses = [
  '0xfd54762d435a490405dda0fbc92b7168934e8525',
  '0x852639ee9dd090d30271832332501e87d287106c',
  '0x77ee88b1c9cce741ec35553730eb1f19cd45a379',
  '0x39e098a153ad69834a9dac32f0fca92066ad03f4',
];

export const Maverick = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'Maverick',
      id: 'maverick',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      url: 'https://app.mav.xyz/',
      activeMonths: 0,
      activeWeeks: 0,
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
