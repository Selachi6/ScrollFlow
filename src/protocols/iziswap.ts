import { countTransactionPeriods } from '../utils/utils.ts';
import { Protocol } from '../services/scroll/types.ts';
import { Transaction } from '../services/scroll/scroll.ts';

const addresses: string[] = [
  '0x2db0AFD0045F3518c77eC6591a542e326Befd3D7',
  '0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08',
  '0x4d4673745AAC664eFB9758fdd571F40d78a87bfe',
  '0xbD6abA1Ef82A4cD6e15CB05e95f433ef48dfb5df',
  '0x32D02Fc7722E81F6Ac60B87ea8B4b63a52Ad2b55',
  '0xF4efDB5A1E852f78e807fAE7100B1d38351e38c7',
  '0xe96526e92ee57bBD468DA1721987aa988b008768',
  '0x3EF68D3f7664b2805D4E88381b64868a56f88bC4',
  '0x33531bDBFE34fa6Fd5963D0423f7699775AacaaF',
  '0x1502d025BfA624469892289D45C0352997251728',
  '0x19b683A2F45012318d9B2aE1280d68d3eC54D663',
].map((address) => address.toLowerCase());

export const IziSwap = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: Protocol = {
      name: 'iZiSwap',
      id: 'iziswap',
      lastActivity: 0,
      volume: 0,
      interactions: 0,
      activeDays: 0,
      activeMonths: 0,
      activeWeeks: 0,
      url: 'https://izumi.finance/',
    };

    transactions.forEach((transaction: Transaction) => {
      if (addresses.includes(transaction.to.toLowerCase())) {
        if (!protocolState.lastActivity) protocolState.lastActivity = transaction.receivedAt;
        if (new Date(protocolState.lastActivity) < new Date(transaction.receivedAt))
          protocolState.lastActivity = transaction.receivedAt;
        protocolState.interactions += 1;

        const transfers = transaction.transfers.sort(
          (a, b) =>
            parseInt(b.value) * 10 ** -b.tokenDecimal * b.price - parseInt(a.value) * 10 ** -a.tokenDecimal * a.price,
        );

        if (transfers.length === 0) return;
        protocolState.volume += parseInt(transfers[0].value) * 10 ** -transfers[0].tokenDecimal * transfers[0].price;
      }
    });

    protocolState.activeDays = countTransactionPeriods(address, transactions, protocolState.id, addresses).days;
    protocolState.activeWeeks = countTransactionPeriods(address, transactions, protocolState.id, addresses).weeks;
    protocolState.activeMonths = countTransactionPeriods(address, transactions, protocolState.id, addresses).months;

    return protocolState;
  },
};
