import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import serverReducer from '../components/slices/ServerSlice';

// Configuration de la persistance
const persistConfig = {
  key: 'root',
  storage,
};

// Création des reducers
const rootReducer = combineReducers({
    server: serverReducer,
});

// Création du reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Création du store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false // Désactivation de la vérification de sérialisation
    }),
});

// Création du persistor
export const persistor = persistStore(store);


