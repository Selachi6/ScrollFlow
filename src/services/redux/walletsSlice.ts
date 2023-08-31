import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface WalletsState {
  wallets: {
    name: string;
    address: string;
  }[];
}

const initialState: WalletsState = {
  wallets: [],
};

export const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    addWallet: (state, action: PayloadAction<{ name: string; address: string }>) => {
      if (state.wallets.find((wallet) => wallet.address === action.payload.address)) return;
      state.wallets.push(action.payload);
    },
    removeWallet: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.filter((wallet) => wallet.address !== action.payload);
    },
    updateWallet: (state, action: PayloadAction<{ name: string; address: string }>) => {
      const wallet = state.wallets.find((wallet) => wallet.address === action.payload.address);
      if (!wallet) return;
      wallet.name = action.payload.name;
    },
  },
});

export const { addWallet, removeWallet, updateWallet } = walletsSlice.actions;

export default walletsSlice.reducer;
