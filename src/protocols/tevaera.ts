import { Transaction } from '../services/era-explorer/era-explorer.ts';
import { Protocol } from '../services/era-explorer/types.ts';
import { countTransactionPeriods } from '../utils/utils.ts';

const addresses: string[] = [
  '0xd29aa7bdd3cbb32557973dad995a3219d307721f',
  '0x1eb7bcab5edf75b5e02c9a72d3287e322ebaefdb',
  '0x50b2b7092bcc15fbb8ac74fe9796cf24602897ad',
  '0x0969529a8ea41b47009eb2a590fe71d7942e4f5a',
  '0x9fc20170d613766831f164f1831f4607ae54ff2d',
];

export const Tevaera = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'Tevaera',
      id: 'tevaera',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      activeWeeks: 0,
      activeMonths: 0,
      url: 'https://tevaera.com/',
    };

    transactions.forEach((transaction: Transaction) => {
      if (addresses.includes(transaction.to.toLowerCase()) || addresses.includes(transaction.from.toLowerCase())) {
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
