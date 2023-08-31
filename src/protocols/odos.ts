import { Transaction } from '../services/era-explorer/era-explorer.ts';
import { Protocol } from '../services/era-explorer/types.ts';
import { countTransactionPeriods } from '../utils/utils.ts';

const addresses: string[] = ['0x4bba932e9792a2b917d47830c93a9bc79320e4f7'];

export const Odos = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'Odos',
      id: 'odos',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      activeWeeks: 0,
      activeMonths: 0,
      url: 'https://app.odos.xyz/',
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
