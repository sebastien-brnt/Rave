import { createSlice } from "@reduxjs/toolkit";

// Création du slice pour les sons convertis
const convertedSlice = createSlice({
  name: "converted",
  initialState: {
    convertedSounds: [], // Liste des fichiers audio
  },
  reducers: {
    // Réducteur pour définir la liste complète des sons convertis
    setConvertedSounds: (state, action) => {
      state.convertedSounds = action.payload;
    },

    // Réducteur pour ajouter un son converti à la liste
    addConvertedSound: (state, action) => {
        state.convertedSounds.push(action.payload);
        console.log(state.convertedSounds);
    },

    // Réducteur pour supprimer un son converti de la liste
    removeConvertedSound: (state, action) => {
      state.convertedSounds = state.convertedSounds.filter(
        (sound) => sound.fileName !== action.payload.fileName
      );
    }
  },
});

// Exportation des actions générées par le slice
export const { setConvertedSounds, addConvertedSound, removeConvertedSound } = convertedSlice.actions;

// Sélecteur pour obtenir tous les sons convertis
export const convertedSoundsSelector = (state) => state.converted.convertedSounds;

// Exportation du réducteur pour l'intégration dans le store
export default convertedSlice.reducer;
