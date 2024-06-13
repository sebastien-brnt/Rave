import { createSlice } from "@reduxjs/toolkit";

const soundSlice = createSlice({
  name: "sounds",
  initialState: {
    sounds: [], // Liste des fichiers audio
    selectedSound: null, // Son actuellement sélectionné
  },
  reducers: {
    // Reducer pour définir les audios
    setSounds: (state, action) => {
      state.sounds = action.payload;
    },

    // Reducer pour supprimer un audio
    removeSound: (state, action) => {
      state.sounds = state.sounds.filter((sound) => sound !== action.payload);
    },

    // Reducer pour sélectionner un audio
    selectSound: (state, action) => {
      state.selectedSound = action.payload;
    },

    // Reducer pour désélectionner un audio
    deselectSound: (state) => {
      state.selectedSound = null;
    },
  },
});

export const { setSounds, removeSound, selectSound, deselectSound } =
  soundSlice.actions;

// Sélecteur pour obtenir tous les audios
export const soundsSelector = (state) => state.sounds.sounds;

// Sélecteur pour obtenir le son sélectionné
export const selectedSoundSelector = (state) => state.sounds.selectedSound;

export default soundSlice.reducer;
