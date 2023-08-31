import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import walletsSlice from './walletsSlice.ts';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import storage from 'redux-persist/lib/storage';
import dataSlice from './dataSlice.ts';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['walletsData'],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    wallets: walletsSlice,
    walletsData: dataSlice,
  }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
