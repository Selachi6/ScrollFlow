import { countTransactionPeriods } from '../utils/utils.ts';
import { Transaction } from '../services/era-explorer/era-explorer.ts';
import { Protocol } from '../services/era-explorer/types.ts';

const addresses: string[] = [
  '0xdfaab828f5f515e104baaba4d8d554da9096f0e4',
  '0xb85feb6af3412d690dfda280b73eaed73a2315bc',
  '0x8b791913eb07c32779a16750e3868aa8495f5964',
];

export const Mute = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'Mute.io',
      id: 'muteio',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      url: 'https://mute.io/',
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
