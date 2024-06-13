import { createSlice } from "@reduxjs/toolkit";

const modelsSlice = createSlice({
  name: "models",
  initialState: {
    models: [], // Liste des modèles
    selectedModel: null, // Modèle actuellement sélectionné
  },
  reducers: {
    // Reducer pour ajouter des modèles
    setModel: (state, action) => {
      state.models = action.payload;
    },

    // Reducer pour enlever un modèle
    removeModel: (state, action) => {
      state.models = state.models.filter((model) => model !== action.payload);
    },

    // Reducer pour sélectionner un modèle
    selectModel: (state, action) => {
      state.selectedModel = action.payload;
    },

    // Reducer pour désélectionner un modèle
    deselectModel: (state) => {
      state.selectedModel = null;
    },
  },
});

export const { setModel, removeModel, selectModel, deselectModel } = modelsSlice.actions;

// Sélecteur pour obtenir tous les modèles
export const modelsSelector = (state) => state.models.models;

// Sélecteur pour obtenir le modèle sélectionné
export const selectedModelSelector = (state) => state.models.selectedModel;

export default modelsSlice.reducer;
