import { combineReducers, configureStore } from "@reduxjs/toolkit";

import connectionsReducer from "./connectionsSlice";
import twitchReducer from "./twitchSlice";
import spotifyReducer from "./spotifySlice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistCombineReducers,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/es/persistReducer";

const rootReducer = combineReducers({
  connections: persistReducer(
    { key: "connections", storage },
    connectionsReducer
  ),
  settings: persistCombineReducers(
    { key: "settings", storage },
    {
      twitch: twitchReducer,
      spotify: spotifyReducer,
    }
  ),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
