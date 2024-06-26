import * as FileSystem from "expo-file-system";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { addSound } from "../slices/SoundSlice";
import CustomButton from "../common/CustomButton";
import Toast from "react-native-toast-message";

export default function AudioScreen() {
  const dispatch = useDispatch();
  const [sound, setSound] = useState(null); // Etat pour le son
  const [recording, setRecording] = useState(null); // Etat pour l'enregistrement
  const [recordingUri, setRecordingUri] = useState(null); // Etat pour l'URI de l'enregistrement
  const [permissionResponse, requestPermission] = Audio.usePermissions(); // Etat pour la réponse de la demande de permission
  const [fileName, setFileName] = useState("");

  // Fonction pour démarrer l'enregistrement
  async function startRecording() {
    console.log("Start recording...");

    // Vérification qu'un enregistrement n'est pas déjà en cours
    if (recording) {
      console.log("Recording already in progress");
      return;
    }

    try {
      // Demander la permission d'accéder au micro si nécessaire
      if (permissionResponse?.status !== "granted") {
        const response = await requestPermission();
        if (response.status !== "granted") return;
      }

      // Autoriser l'enregistrement sur iOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true, // Autoriser l'enregistrement sur iOS
        playsInSilentModeIOS: true, // Jouer le son en mode silencieux sur iOS
      });

      // Configuration pour l'enregistrement audio
      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 16000, // Baisse de la qualité
          numberOfChannels: 1,
          bitRate: 32000, // Baisse de la qualité
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW,
          sampleRate: 16000, // Baisse de la qualité
          numberOfChannels: 1,
          bitRate: 32000, // Baisse de la qualité
        },
      };
      

      // Commencer l'enregistrement
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();

      setRecording(recording);
    } catch (error) {
      console.error(error);
    }
  }

  // Fonction pour arrêter l'enregistrement
  async function stopRecording() {
    console.log("Stop recording...");
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false, // Désactiver l'enregistrement sur iOS
      });
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
    } catch (error) {
      console.error(error);
    }
  }

  // Fonction pour jouer le son
  async function playSound() {
    try {
      if (!recordingUri) return;

      // Configuration de l'audio
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true, // Jouer le son en mode silencieux sur iOS
      });

      // Création de l'audio
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      console.log("Playing Sound...");
      await sound.playAsync();
    } catch (error) {
      console.error(error);
    }
  }

  // Fonction de sauvegarde de l'audio dans le téléphone
  async function saveRecording() {
    if (!recordingUri || !fileName) {
      // Affichage d'une alerte si aucun enregistrement ou nom de fichier
      console.log("Saving error, no record or file name");
      Alert.alert("Erreur d'enregistrement", "Veuillez enregistrer un audio et saisir un nom de fichier");
      return;
    }

    try {
      // Path du dossier d'enregistrement
      const directory = `${FileSystem.documentDirectory}recordings/`;

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
        // Affichage d'une alerte si le fichier existe déjà
        Alert.alert("Erreur d'enregistrement", "Le nom du fichier est déjà utilisé");
        return;
      }

      // Enregistrement
      await FileSystem.moveAsync({
        from: recordingUri,
        to: fileUri,
      });

      // AJout du son dans le store
      dispatch(addSound({ name: fileName, fileName: cleanFileName + ".m4a", uri: fileUri }));

      setRecordingUri(null); // Réinitialise l'URI de l'enregistrement après la sauvegarde
      setFileName(""); // Réinitialise le nom du fichier après la sauvegarde

      // Affichage d'une alerte de succès
      Alert.alert("Enregistrement sauvegardé", "L'audio a été sauvegardé avec succès");
      
    } catch (error) {
      console.error("Error saving recording:", error);
      Alert.alert("Erreur d'enregistrement", "Une erreur est survenue lors de la sauvegarde de l'audio");
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          // Libérer la mémoire allouée à l'audio précédent
          console.log("Unloading Sound...");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <View style={styles.toast}>
        <Toast />
      </View>

      <Text style={styles.title}>Enregistrement d'un audio</Text>

      <View style={styles.row}>
        {/* Bouton de démarrage et d'arrêt et de lecture de l'enregistrement */}
        <TouchableOpacity
          style={styles.recordingButton}
          onPress={startRecording}
        >
          <Image
            source={require("../../assets/play.png")}
            style={{
              width: 45,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordingButton}
          onPress={stopRecording}
        >
          <Image
            source={require("../../assets/stop.png")}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
      </View>

      {/* Affichage d'un message d'enregistremebt */}
      {recording && (
        <Text style={styles.recordingText}>Enregistrement en cours ...</Text>
      )}

      {/* Affichage du bouton de lecture si un audio a été enregistré */}
      {recordingUri && (
        <CustomButton title="Lire l'enregistrement" event={playSound} />
      )}

      <Text style={styles.titleSecond}>Sauvegarde dans le téléphone</Text>

      {/* Champs de saisie du nom de l'audio à enregistrer */}
      <TextInput
        placeholder="Nom du fichier audio"
        style={styles.fileName}
        onChangeText={setFileName}
        value={fileName}
      />

      {/* Bouton d'enregistrement de l'audio */}
      <CustomButton
        style={styles.buttonSave}
        title="Sauvegarder l'audio"
        event={saveRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  toast: {
    zIndex: 999,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
  },
  titleSecond: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
  },
  fileName: {
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 10,
  },
  recordingButton: {
    padding: 20,
    borderRadius: 10,
    flex: 1,
    borderWidth: 2,
    borderColor: "#6A5ACD",
    alignItems: "center",
    justifyContent: "center",
  },
  recordingText: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  }
});
