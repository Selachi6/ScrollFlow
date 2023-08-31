import { Header } from '../components/Header.tsx';
import { SmallCard } from '../components/SmallCard.tsx';
import { WalletCard } from '../components/WalletCard.tsx';
import { useEffect, useState } from 'react';
import { WalletModal } from '../components/WalletModal.tsx';
import { useAppDispatch, useAppSelector } from '../services/redux/hooks.ts';
import { getWalletInformation } from '../utils/wallet.ts';
import { addWalletData, removeWalletData } from '../services/redux/dataSlice.ts';
import { WalletInformation } from '../services/era-explorer/types.ts';
import { DonateModal } from '../components/DonateModal.tsx';

const getTotalFee = (wallets: WalletInformation[]) => {
  let fees = 0;
  let feesChange = 0;

  wallets.forEach((wallet) => {
    fees += wallet.fees;
    feesChange += wallet.feesChange;
  });
  return { fees, feesChange };
};

const getTotalVolume = (wallets: WalletInformation[]) => {
  let volume = 0;
  let volumeChange = 0;

  wallets.forEach((wallet) => {
    volume += wallet.volume;
    volumeChange += wallet.volumeChange;
  });
  return { volume, volumeChange };
};

const getTotalInteractions = (wallets: WalletInformation[]) => {
  let interactions = 0;
  let interactionsChange = 0;

  wallets.forEach((wallet) => {
    interactions += wallet.interactions;
    interactionsChange += wallet.interactionsChange;
  });
  return { interactions, interactionsChange };
};

export const Overview = () => {
  const [walletsModal, setWalletsModal] = useState(false);
  document.title = 'zkFlow | Overview';

  const dispatch = useAppDispatch();

  const wallets = useAppSelector((state) => state.wallets.wallets);
  const walletsData = useAppSelector((state) => state.walletsData.wallets);

  const fetchData = async () => {
    walletsData.forEach((wallet) => {
      if (!wallets.find((w) => w.address === wallet.address)) {
        dispatch(removeWalletData(wallet.address));
      }
    });
    for (let i = 0; i < wallets.length; i++) {
      if (!walletsData.find((w) => w.address === wallets[i].address)) {
        const tmp = await getWalletInformation(wallets[i].address);
        dispatch(addWalletData(tmp));
      }
    }
  };

  useEffect(() => {
    if (!walletsModal) fetchData();
  }, [walletsModal]);

  return (
    <>
      <Header />
      <div className="grid mt-36 place-items-center">
        <div className="flex">
          <div>
            <h1 className="font-bold text-6xl text-white mb-5">Wallets overviews</h1>
            <p className="text-white font-light text-2xl max-w-4xl">Here is all the data of your wallets.</p>
          </div>
          <button
            className="w-40 h-14 mt-3 ml-36 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => setWalletsModal(!walletsModal)}
          >
            Manage wallets
          </button>
        </div>
        <div className="flex items-center flex-row space-x-5 mt-10 ml-8 mr-10">
          <SmallCard
            title={'Total interactions'}
            value={getTotalInteractions(walletsData).interactions.toString()}
            change={getTotalInteractions(walletsData).interactionsChange.toString()}
            loading={false}
          />
          <SmallCard
            title={'Total volume'}
            value={'$' + getTotalVolume(walletsData).volume.toFixed()}
            change={'$' + getTotalVolume(walletsData).volumeChange.toFixed()}
            loading={false}
          />
          <SmallCard
            title={'Total fees'}
            value={'$' + getTotalFee(walletsData).fees.toFixed(1)}
            change={'$' + getTotalFee(walletsData).feesChange.toFixed(1)}
            loading={false}
          />
        </div>
        {walletsData.map((wallet) => (
          <WalletCard wallet={wallet} key={wallet.address} />
        ))}
      </div>
      {walletsModal && <WalletModal setWalletModal={setWalletsModal} />}
      <DonateModal />
    </>
  );
};
