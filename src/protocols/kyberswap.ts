import { countTransactionPeriods } from '../utils/utils.ts';
import { Protocol } from '../services/scroll/types.ts';
import { Transaction } from '../services/scroll/scroll.ts';

const addresses: string[] = [
  '0x2db0AFD0045F3518c77eC6591a542e326Befd3D7',
].map((address) => address.toLowerCase());

export const KyberSwap = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'KyberSwap',
      id: 'kyberswap',
      lastActivity: 0,
      volume: 0,
      interactions: 0,
      activeDays: 0,
      activeMonths: 0,
      activeWeeks: 0,
      url: 'https://kyberswap.com/',
    };
    
    transactions.forEach((transaction: Transaction) => {
      
      if (addresses.includes(transaction.to.toLowerCase())) {

        if (!protocolState.lastActivity) protocolState.lastActivity = transaction.receivedAt;
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
