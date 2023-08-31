import { Holdstation } from '../protocols/holdstation.ts';
import { IzumiFinance } from '../protocols/izumi.ts';
import { Maverick } from '../protocols/maverick.ts';
import { Mute } from '../protocols/muteio.ts';
import { OnchainTrade } from '../protocols/onchaintrade.ts';
import { Orbiter } from '../protocols/orbiter.ts';
import { SpaceFi } from '../protocols/spacefi.ts';
import { Starmaker } from '../protocols/starmaker.ts';
import { SyncSwap } from '../protocols/syncswap.ts';
import { Velocore } from '../protocols/velocore.ts';
import { ZkSyncEraPortal } from '../protocols/zksynceraportal.ts';
import { ZkSyncNameService } from '../protocols/zksyncnameservice.ts';
import { Goal3 } from '../protocols/goal3.ts';
import { ZkSyncId } from '../protocols/zksyncid.ts';
import { ZkSwap } from '../protocols/zkswap.ts';
import { XYFinance } from '../protocols/xyfinance.ts';
import { Ezkalibur } from '../protocols/ezkalibur.ts';
import { PancakeSwap } from '../protocols/pancakeswap.ts';
import { Bigint as BigIntProtocol } from '../protocols/bigint.ts';
import { Rollup } from '../protocols/rollup.ts';
import { Transaction } from '../services/era-explorer/era-explorer.ts';
import { Protocol } from '../services/era-explorer/types.ts';
import { Basilisk } from '../protocols/basilisk.ts';
import { Odos } from '../protocols/odos.ts';
import { Tevaera } from '../protocols/tevaera.ts';
import { DraculaFi } from '../protocols/dracula.ts';

export const getProtocols = (address: string, transactions: Transaction[]): Protocol[] => {
  const protocols = [
    Holdstation,
    IzumiFinance,
    Maverick,
    Mute,
    OnchainTrade,
    Orbiter,
    SpaceFi,
    Starmaker,
    SyncSwap,
    Velocore,
    ZkSyncEraPortal,
    ZkSyncNameService,
    Goal3,
    Rollup,
    ZkSyncId,
    ZkSwap,
    XYFinance,
    Ezkalibur,
    BigIntProtocol,
    PancakeSwap,
    Basilisk,
    Odos,
    Tevaera,
    DraculaFi,
  ];

  return protocols
    .map((protocol: any) => {
      return protocol.getProtocolsState(transactions, address);
    })
    .sort((a: Protocol, b: Protocol) => {
      return b.volume - a.volume;
    });
};
