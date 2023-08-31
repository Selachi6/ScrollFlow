import { countTransactionPeriods } from '../utils/utils.ts';
import { Transaction } from '../services/era-explorer/era-explorer.ts';
import { Protocol } from '../services/era-explorer/types.ts';

export const ZkSyncEraPortal = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'zkSync Era Portal',
      id: 'zksynceraportal',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      activeMonths: 0,
      activeWeeks: 0,
      url: 'https://portal.zksync.io/bridge',
    };

    transactions.forEach((transaction: Transaction) => {
      if (
        (transaction.to.toLowerCase() === '0x000000000000000000000000000000000000800a' &&
          transaction.data.startsWith('0x51cff8d9')) ||
        (transaction.to.toLowerCase() === address.toLowerCase() && transaction.isL1Originated)
      ) {
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

    protocolState.activeDays = countTransactionPeriods(address, transactions, protocolState.id, [
      '0x000000000000000000000000000000000000800a',
    ]).days;
    protocolState.activeWeeks = countTransactionPeriods(address, transactions, protocolState.id, [
      '0x000000000000000000000000000000000000800a',
    ]).weeks;
    protocolState.activeMonths = countTransactionPeriods(address, transactions, protocolState.id, [
      '0x000000000000000000000000000000000000800a',
    ]).months;

    return protocolState;
  },
};
