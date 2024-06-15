import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ip: null,          // IP du serveur
  port: null,        // Port du serveur
  isConnected: false // Indicateur de connexion au serveur
};

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    // Reducer pour définir l'IP et le port du serveur
    setServerInfo: (state, action) => {
      state.ip = action.payload.ip;
      state.port = action.payload.port;
    },

    // Reducer pour indiquer la connexion au serveur
    setConnected: (state) => {
      state.isConnected = true;
    },

    // Reducer pour indiquer la déconnexion du serveur
    setDisconnected: (state) => {
      state.isConnected = false;
    }
  }
});

export const { setServerInfo, setConnected, setDisconnected } = serverSlice.actions;

// Sélecteur pour obtenir l'IP du serveur
export const serverIpSelector = (state) => state.server.ip;

// Sélecteur pour obtenir le port du serveur
export const serverPortSelector = (state) => state.server.port;

// Sélecteur pour vérifier l'état de connexion
export const isConnectedSelector = (state) => state.server.isConnected;

export default serverSlice.reducer;
