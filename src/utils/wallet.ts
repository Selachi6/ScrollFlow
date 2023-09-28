import { WalletInformation } from '../services/era-explorer/types.ts';
import { getTokenList, getTransactionsList, Transaction } from '../services/era-explorer/era-explorer.ts';
import { getActive } from './utils.ts';
import axios from 'axios';
import { getProtocols } from './protocols.ts';

const getZksyncLite = async (address: string) => {
  const response = await axios.get(
    `https://api.zksync.io/api/v0.2/accounts/${address}/transactions?from=latest&limit=100&direction=older`,
  );

  if (response.data.result.list.length === 0) return { interactions: 0, lastActivity: 0, activatedOn: 0 };

  return {
    interactions: response.data.result.list.length,
    lastActivity: new Date(response.data.result.list[0].createdAt).getTime(),
    activatedOn: new Date(response.data.result.list[response.data.result.list.length - 1].createdAt).getTime(),
  };
};

const getLastActivity = (transactions: Transaction[]) => {
  let lastActivity = 0;

  transactions.forEach((transaction) => {
    if (new Date(transaction.receivedAt).getTime() > lastActivity) {
      lastActivity = new Date(transaction.receivedAt).getTime();
    }
  });

  return lastActivity;
};

const getInteractedContracts = (transactions: Transaction[]) => {
  const interactedContracts: Set<string> = new Set();
  const interactedContractsChange: Set<string> = new Set();

  transactions.forEach((transaction: Transaction) => {
    if (interactedContracts.has(transaction.to)) return;
    interactedContracts.add(transaction.to);
    if (new Date(transaction.receivedAt).getTime() >= new Date().getTime() - 86400 * 7 * 1000) {
      interactedContractsChange.add(transaction.to);
    }
  });

  return { interactedContracts: interactedContracts.size, interactedContractsChange: interactedContractsChange.size };
};

const getFees = (transactions: Transaction[], address: string) => {
  let fees = 0;
  let feesChange = 0;

  transactions.forEach((transaction) => {
    if (transaction.from.toLowerCase() !== address.toLowerCase()) return;
    const tmpFees = parseInt(transaction.fee, 16) * 10 ** -18 * transaction.ethValue;
    fees += tmpFees;
    if (new Date(transaction.receivedAt).getTime() >= new Date().getTime() - 86400 * 7 * 1000) {
      feesChange += tmpFees;
    }
  });

  return { fees: fees, feesChange: feesChange };
};

const getVolume = (transactions: Transaction[]) => {
  let volume = 0;
  let volumeChange = 0;

  transactions.forEach((transaction) => {
    const transfers = transaction.transfers.sort(
      (a, b) =>
        parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
        parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price,
    );
    if (transfers.length === 0) return;
    const tmpVolume = parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * transfers[0].token.price;
    volume += tmpVolume;
    if (new Date(transaction.receivedAt).getTime() >= new Date().getTime() - 86400 * 7 * 1000) {
      volumeChange += tmpVolume;
    }
  });

  return { volume: volume, volumeChange: volumeChange };
};

const getInteraction = (transactions: Transaction[], address: string) => {
  let interactions = 0;
  let interactionsChange = 0;

  transactions.forEach((transaction) => {
    if (transaction.from.toLowerCase() === address.toLowerCase()) {
      interactions++;
      if (new Date(transaction.receivedAt).getTime() >= new Date().getTime() - 86400 * 7 * 1000) {
        interactionsChange++;
      }
    }
  });

  return { interactions: interactions, interactionsChange: interactionsChange };
};

const getBalance = async (address: string) => {
  let totalBalance = 0;
  const ethResponse = await axios.post('https://mainnet.era.zksync.io/', {
    id: 1,
    jsonrpc: '2.0',
    method: 'zks_getTokenPrice',
    params: ['0x0000000000000000000000000000000000000000'],
  });

  const stable = ['USDC', 'USDT', 'ZKUSD', 'CEBUSD', 'LUSD'];

  try {
    const response = await axios.get('https://block-explorer-api.mainnet.zksync.io/address/' + address);
    Object.entries(response.data.balances).forEach((balance: any) => {
      if (balance[0] === '0x000000000000000000000000000000000000800A')
        totalBalance += parseInt(balance[1].balance) * 10 ** -18 * parseInt(ethResponse.data.result);
      if (balance[1].token && balance[1].token.symbol) {
        if (stable.includes(balance[1].token.symbol)) {
          totalBalance += parseInt(balance[1].balance) * 10 ** -balance[1].token.decimals;
        }
      }
    });
  } catch (e) {
    console.log('Impossible to get balance');
    return 0;
  }

  return totalBalance;
};

export const getWalletInformation = async (address: string) => {
  const transactions = await getTransactionsList(address);
  const zksynclite = await getZksyncLite(address);

  if (transactions.length === 0)
    return {
      address: address,
      interactions: 0,
      interactionsChange: 0,
      volume: 0,
      volumeChange: 0,
      fees: 0,
      feesChange: 0,
      interactedContracts: 0,
      interactedContractsChange: 0,
      rank: 0,
      token: [],
      lastActivity: 0,
      activeDays: 0,
      activeWeeks: 0,
      activeMonths: 0,
      protocols: getProtocols(address, transactions),
      zksynclite: {
        interactions: 0,
        lastActivity: 0,
        activatedOn: 0,
      },
      balance: 0,
    };

  const wallet: WalletInformation = {
    address: address,
    interactions: getInteraction(transactions, address).interactions,
    interactionsChange: getInteraction(transactions, address).interactionsChange,
    volume: getVolume(transactions).volume,
    volumeChange: getVolume(transactions).volumeChange,
    fees: getFees(transactions, address).fees,
    feesChange: getFees(transactions, address).feesChange,
    interactedContracts: getInteractedContracts(transactions).interactedContracts,
    interactedContractsChange: getInteractedContracts(transactions).interactedContractsChange,
    rank: 0,
    token: await getTokenList(address),
    lastActivity: getLastActivity(transactions),
    activeDays: getActive(address, transactions).days,
    activeWeeks: getActive(address, transactions).weeks,
    activeMonths: getActive(address, transactions).months,
    protocols: getProtocols(address, transactions),
    zksynclite: {
      interactions: zksynclite.interactions,
      lastActivity: zksynclite.lastActivity,
      activatedOn: zksynclite.activatedOn,
    },
    balance: await getBalance(address),
  };

  return wallet;
};
