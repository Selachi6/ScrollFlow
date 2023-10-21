import { Scroll } from '../protocols/scrollbridge.ts';
import { SyncSwap } from '../protocols/syncswap.ts';
import { Orbiter } from '../protocols/orbiter.ts';
import { PunkSwap } from '../protocols/punkswap.ts';
import { CattieSwap } from '../protocols/cattieswap.ts';
import { Skydrome } from '../protocols/skydrome.ts';
import { SpaceFi } from '../protocols/spacefi.ts';
import { IziSwap } from '../protocols/iziswap.ts';

import { Transaction } from '../services/scroll/scroll.ts';
import { Protocol } from '../services/scroll/types.ts';

export const getProtocols = (address: string, transactions: Transaction[]): Protocol[] => {
  const protocols = [SyncSwap, Skydrome, PunkSwap, CattieSwap, SpaceFi, IziSwap, Orbiter, Scroll];

  return protocols
    .map((protocol: any) => {
      return protocol.getProtocolsState(transactions, address);
    })
    .sort((a: Protocol, b: Protocol) => {
      return b.volume - a.volume;
    });
};
