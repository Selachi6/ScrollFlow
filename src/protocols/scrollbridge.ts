import { countTransactionPeriods } from '../utils/utils.ts';
import { Transaction } from '../services/scroll/scroll.ts';
import { Protocol } from '../services/scroll/types.ts';

const addresses: string[] = [
  '0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79',
  '0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6',
].map((address) => address.toLowerCase());

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

        protocolState.volume += (transaction.value / 10 ** 18) * transaction.ethValue;
      }
    });

    protocolState.activeDays = countTransactionPeriods(address, transactions, protocolState.id, addresses).days;
    protocolState.activeWeeks = countTransactionPeriods(address, transactions, protocolState.id, addresses).weeks;
    protocolState.activeMonths = countTransactionPeriods(address, transactions, protocolState.id, addresses).months;
    return protocolState;
  },
};
