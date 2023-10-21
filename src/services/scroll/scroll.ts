import axios, { AxiosResponse } from 'axios';

export interface Token {
  price: number | undefined;
  balance: number;
  contractAddress: string;
  decimals: number;
  name: string;
  symbol: string;
  type: string;
}

export interface Transfer {
  from: string;
  to: string;
  hash: string;
  timeStamp: string;
  value: string;
  contractAddress: string;
  fields: null;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimal: number;
  price: number;

}

export interface Transaction {
  hash: string;
  to: string;
  from: string;
  fee: string;
  receivedAt: number;
  transfers: Transfer[];
  ethValue: number;
}

export const getTokenList = async (address: string): Promise<Token[]> => {
  return axios
    .get(`https://blockscout.scroll.io/api?module=account&action=tokenlist&address=${address}`)
    
    .then((res) => {
      const tokens = res.data.result;

      return tokens
        .sort((a: Token) => {
          return a.type === 'ERC-721' ? 1 : -1;
        })
        .filter((token: Token) => {
          return token.name !== null;
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAllTransfers = async (address: string): Promise<Transfer[]> => {
  let url = `https://api.scrollscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=2500000&sort=asc&apikey=YourApiKeyToken`;
  
  
  const transfers: Transfer[] = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const response: AxiosResponse = await axios.get(url);
      if (response.status === 200) {
        const data = response.data.result;
        transfers.push(...data);

        if (!response.data.links || !response.data.links.next) {
          break;
        }
        url = 'https://rpc.scroll.io/' + response.data.links.next;
      } else {
        console.error('Error occurred while retrieving transactions.');
        break;
      }
    } catch (error) {
      console.error('Error occurred while making the request:', error);
      break;
    }
  }

  return transfers;
};

const assignTransferValues = async (transactions: Transaction[]) => {
  const ethResponse = await axios.post('https://mainnet.era.zksync.io/', {
    id: 42,
    jsonrpc: '2.0',
    method: 'zks_getTokenPrice',
    params: ['0x0000000000000000000000000000000000000000'],
  });

  const tokensPrice: any = {
    USDC: 1,
    USDT: 1,
    WETH: parseInt(ethResponse.data.result),
  };

  transactions.forEach((transaction: Transaction) => {

    transaction.transfers.forEach((transfer: Transfer) => {
      transfer.price = tokensPrice[transfer.tokenSymbol.toUpperCase()];

    });
   
    transaction.transfers = transaction.transfers.filter((transfer: Transfer) => transfer.price !== undefined);
  });
  
};

export const getTransactionsList = async (address: string): Promise<Transaction[]> => {
  let url = `https://api.scrollscan.com/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=YourApiKeyToken`;
  
  const transactions: Transaction[] = [];

  const ethResponse = await axios.post('https://mainnet.era.zksync.io/', {
    id: 42,
    jsonrpc: '2.0',
    method: 'zks_getTokenPrice',
    params: ['0x0000000000000000000000000000000000000000'],
  });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const response: AxiosResponse = await axios.get(url);
      if (response.status === 200) {
        const data = response.data.result;
        data.forEach((transaction: any) => {
          const { hash, to, from, cumulativeGasUsed, timeStamp } = transaction;
          transactions.push({
            hash: hash,
            to: to,
            from: from,
            fee: cumulativeGasUsed,
            receivedAt: Number(timeStamp) * 1000,
            transfers: [],
            
            
            ethValue: parseInt(ethResponse.data.result),
          });
        });
        

        if (!response.data.links || !response.data.links.next) {
          break;
        }
        url = 'https://api.scrollscan.com/' + response.data.links.next;
      } else {
        console.error('Error occurred while retrieving transactions.');
        break;
      }
    } catch (error) {
      console.error('Error occurred while making the request:', error);
      break;
    }
    
  }

  const transfers: Transfer[] = await getAllTransfers(address);
  transfers.forEach((transfer: Transfer) => {
    transactions.forEach((transaction: Transaction) => {
      if (transaction.hash === transfer.hash) {
        transaction.transfers.push(transfer); // Access 'transfers' without type assertion
      }
    });
  });

  await assignTransferValues(transactions);

  return transactions;
  
};
