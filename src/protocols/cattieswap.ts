import { countTransactionPeriods } from '../utils/utils.ts';
import { Protocol } from '../services/scroll/types.ts';
import { Transaction } from '../services/scroll/scroll.ts';

const addresses: string[] = [
  '0xC5864D2Ee48982BfDd50479061e89Fa11671fe13',
  '0x021651105Df2FB2F2b0B001E703ebDD9e1494E6A',
].map((address) => address.toLowerCase());

export const CattieSwap = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'CattieSwap',
      id: 'cattieswap',
      lastActivity: 0,
      volume: 0,
      interactions: 0,
      activeDays: 0,
      activeMonths: 0,
      activeWeeks: 0,
      url: 'https://www.cattieswap.xyz/',
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
