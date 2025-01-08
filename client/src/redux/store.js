import { combineReducers, configureStore } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  // blacklist: ['checkoutProducts']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// middleware is added to be safe from any warnings
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// export the persistor
export const persistor = persistStore(store);
