import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { WalletInformation } from '../scroll/types.ts';

export interface WalletsState {
  wallets: WalletInformation[];
}

const initialState: WalletsState = {
  wallets: [],
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addWalletData: (state, action: PayloadAction<WalletInformation>) => {
      if (state.wallets.find((wallet) => wallet.address === action.payload.address)) return;
      state.wallets.push(action.payload);
    },
    removeWalletData: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.filter((wallet) => wallet.address !== action.payload);
    },
  },
});

export const { addWalletData, removeWalletData } = dataSlice.actions;

export default dataSlice.reducer;
