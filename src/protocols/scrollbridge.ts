import { countTransactionPeriods } from '../utils/utils.ts';
import { Transaction } from '../services/scroll/scroll.ts';
import { Protocol } from '../services/scroll/types.ts';

const addresses: string[] = [
  '0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79',
  '0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6',
];

export const Scroll = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'Scroll Bridge',
      id: 'scroll',
      lastActivity: 0,
      volume: 0,
      interactions: 0,
      activeDays: 0,
      url: 'https://scroll.io/bridge',
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