import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { persistReducer } from 'redux-persist';
import { REGISTER, PAUSE, PURGE, PERSIST, FLUSH, REHYDRATE } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const reducers = combineReducers({ user: userReducer });
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REGISTER, REHYDRATE, PURGE, FLUSH, PERSIST, PAUSE],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
