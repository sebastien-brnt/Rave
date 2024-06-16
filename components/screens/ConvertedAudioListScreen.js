import * as FileSystem from "expo-file-system";
import { View, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import ItemSound from "../sound/ItemSound";

export default function ConvertedAudioListScreen() {
  const navigation = useNavigation();
  const [audioFiles, setAudioFiles] = useState([]);

  // Fonction pour récupérer la liste des fichiers audio
  async function loadAudioFiles() {
    try {
      // Path du dossier d'enregistrement
      const directory = `${FileSystem.documentDirectory}savedConvertedSound/`;

      // Création du sous-dossier s'il n'existe pas
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      const files = await FileSystem.readDirectoryAsync(directory);
      setAudioFiles(files);
    } catch (error) {
      console.error("Error loading audio files:", error);
    }
  }

  // Chargement des fichiers audio
  useEffect(() => {
    const focusListener = () => {
      loadAudioFiles();
    };

    // Ajout d'un listener pour recharger les fichiers lorsque l'écran devient actif
    const unsubscribe = navigation.addListener("focus", focusListener);

    // Nettoyage du listener lors du démontage du composant
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audios convertis enregistrés</Text>
      {/* Liste des fichiers audio */}
      {audioFiles.length === 0 && <Text>Aucun fichier audio enregistré</Text>}
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <ItemSound
            sound={item}
            select={false}
            directory="savedConvertedSound"
            last={index === audioFiles.length - 1}
          />
        )}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
};
