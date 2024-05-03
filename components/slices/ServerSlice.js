import { createSlice } from "@reduxjs/toolkit";

const serverSlice = createSlice({
    name: "server",
    initialState: [],  // State par défaut
    reducers: {
        // Reducer pour ajouter un nouveau serveur
        addServer: (state, action) => {
            state.push(action.payload);
        },

        // Reducer pour enlever un serveur
        removeServer: (state, action) => {
            const index = state.findIndex(server => server.ip === action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        }
    }
});

export const { addServer, removeServer } = serverSlice.actions;

// Sélecteur pour obtenir toutes les IP
export const serverSelector = (state) => state.server;

export default serverSlice.reducer;
