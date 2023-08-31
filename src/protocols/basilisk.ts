import { Transaction } from '../services/era-explorer/era-explorer.ts';
import { Protocol } from '../services/era-explorer/types.ts';
import { countTransactionPeriods } from '../utils/utils.ts';

const addresses: string[] = [
  '0x1e8f1099a3fe6d2c1a960528394f4feb8f8a288d',
  '0x01541ead71e41d59f315eb2ce3a9441ed7b0a63e',
  '0x1bd39618892115fcf674112b657c3aad1d1b9602',
  '0x827b641c69228a3f259e7904f63f63c405ba6534',
  '0x2f66631fd6e48b21de53c3777d638132675f7c6a',
  '0x4085f99720e699106bc483dab6caed171eda8d15',
];

export const Basilisk = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'Basilisk',
      id: 'basilisk',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      activeWeeks: 0,
      activeMonths: 0,
      url: 'https://app.basilisk.org/',
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
