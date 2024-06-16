import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import serverReducer from '../components/slices/ServerSlice';
import soundsReducer from '../components/slices/SoundSlice';
import modelsReducer from '../components/slices/ModelSlice';
import convertedReducer from '../components/slices/ConvertedSlice';

// Configuration de la persistance
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['server'] // Exclusion de la sauvegarde du slice server
};

// Création des reducers
const rootReducer = combineReducers({
    server: serverReducer,
    sounds: soundsReducer,
    models: modelsReducer,
    converted: convertedReducer,
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


