import { Token } from './scroll.ts';

export interface Protocol {
  name: string;
  id: string;
  url: string;
  interactions: number;
  lastActivity: number;
  activeDays: number;
  activeWeeks: number;
  activeMonths: number;
  volume: number;
  tag?: string;
}

export interface WalletInformation {
  address: string;
  interactions: number;
  interactionsChange: number;
  volume: number;
  volumeChange: number;
  fees: number;
  feesChange: number;
  interactedContracts: number;
  interactedContractsChange: number;
  rank: number;
  token: Token[];
  lastActivity: number;
  activeDays: number;
  activeWeeks: number;
  activeMonths: number;
  protocols: Protocol[];
  balance: number;
}
