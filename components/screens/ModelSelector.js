import { View, Text, TextInput, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../common/CustomButton";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import { selectedSoundSelector } from "../slices/SoundSlice";
import { useSelector } from "react-redux";
import ItemModel from "../models/ItemModel";
import ItemSound from "../sound/ItemSound";

export default function ModelSelector() {
  const navigation = useNavigation();
  const selectedSound = useSelector(selectedSoundSelector);

  // state pour stocker le modèle sélectionné
  const [fileName, setFileName] = useState("");
  const [models, setModels] = useState([]);

  // Fonction de conversion de l'audio
  async function convertSound() {
    try {
      // Affichage du message de succès
      Toast.show({
        type: "success",
        text1: "Audio converti",
        text2: "L'audio a été converti avec succès",
      });
    } catch (error) {
      console.error("Error converting sound:", error);
      Toast.show({
        type: "error",
        text1: "Erreur de conversion",
        text2: "Une erreur est survenue lors de la conversion de l'audio",
      });
    }
  }

  const getModels = async () => {
    try {
      const response = await fetch("http://192.168.1.13:8000/getmodels", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data.models);
      setModels(data.models);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };


  // Fonction de sauvegarde de l'audio converti dans le téléphone
  async function saveConvertedSound() {
    if (!fileName) {
      console.log("Saving error, no record or file name");
      Toast.show({
        type: "error",
        text1: "Erreur d'enregistrement",
        text2: "Aucun audio ou nom de fichier",
      });
      return;
    }

    try {
      // Path du dossier d'enregistrement des audios convertis
      const directory = `${FileSystem.documentDirectory}convertedSound/`;

      // Création du sous-dossier s'il n'existe pas
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      // Slugify du nom du fichier
      const cleanFileName = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

      // URI
      const fileUri = `${directory}${cleanFileName}.m4a`;

      // Vérification de l'existence du fichier
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        Toast.show({
          type: "error",
          text1: "Erreur d'enregistrement",
          text2: "Le nom du fichier est déjà utilisé",
        });
        return;
      }

      // Enregistrement
      await FileSystem.moveAsync({
        to: fileUri,
      });

      console.log("Recording saved to:", fileUri);
      setFileName(""); // Réinitialise le nom du fichier après la sauvegarde
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  }

  // Chargement des fichiers audio et des modèles disponibles
  useEffect(() => {
    const focusListener = () => {
      getModels();
    };

    // Ajout d'un listener pour recharger les fichiers lorsque l'écran devient actif
    const unsubscribe = navigation.addListener("focus", focusListener);

    // Nettoyage du listener lors du démontage du composant
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélection du modèle</Text>

      {/* Liste des modèles */}
      <FlatList
        style={styles.modelsList}
        data={models}
        scrollEnabled={true}
        renderItem={({ item }) => <ItemModel model={item} />}
        keyExtractor={(item) => item}
      />

      {/* Bouton de conversion */}
      <CustomButton title="Convertir l'audio" event={() => convertSound()} />

      {/* Récapitulatif de l'audio d'origine et celui converti */}
      <Text style={styles.titleSecond}>Récapitulatif</Text>
      { selectedSound ?
        <View style={styles.soundOrigin}>
          <Text>Audio d'origine :</Text>
          <ItemSound sound={selectedSound} actions={false} last={true}/>
        </View>
      : 
        <Text>Aucun audio sélectionné</Text> 
      }
      
      <Text>Audio converti : </Text>

      {/* Enregistrement de l'audio converti */}
      <Text style={styles.titleSecond}>Enregistrer l'audio converti</Text>
      <TextInput
        placeholder="Nom du fichier"
        style={styles.fileName}
        onChangeText={setFileName}
        value={fileName}
      />
      <CustomButton
        title="Enregistrer l'audio converti"
        event={() => saveConvertedSound()}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 30,
  },
  modelsList: {
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  titleSecond: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  fileName: {
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 10,
  },
  soundOrigin: {
    marginBottom: 20,
  }
};
