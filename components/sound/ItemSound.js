import { View, StyleSheet, Text } from "react-native";
import CustomButton from "../common/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { selectSound, deselectSound, selectedSoundSelector } from "../slices/SoundSlice"; // Correction du nom de slice
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import Icon from "react-native-vector-icons/Ionicons";

export default function ItemSound({ sound, actions = true, last = false }) {
  const dispatch = useDispatch();
  const selectedSound = useSelector(selectedSoundSelector);

  // Fonction pour lire un fichier audio
  async function playAudio(file) {
    const path = `${FileSystem.documentDirectory}recordings/${file}`;

    // Configuration de l'audio
    await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true, // Jouer le son en mode silencieux sur iOS
    });


    const { sound: playbackSound } = await Audio.Sound.createAsync({
      uri: path,
    });

    await playbackSound.playAsync();
  }

  // Fonction pour sélectionner ou désélectionner un son
  async function handleSelectSound(soundName) {
    dispatch(soundName ? selectSound(soundName) : deselectSound());

    // Envoi du fichier audio au serveur si c'est le son sélectionné
    if (soundName) {
      sendFile(soundName);
    }
  }

  // Fonction pour envoyer un fichier au serveur
  const sendFile = async (fileName) => {
    const fileUri = `${FileSystem.documentDirectory}recordings/${fileName}`;

    // Adresse du serveur
    const serverAdress = "http://192.168.1.13:8000";

    const resp = await FileSystem.uploadAsync(
      serverAdress + "/upload",
      fileUri,
      {
        fieldName: fileName,
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: { filename: fileUri },
      }
    );
    console.log(resp.body);
  };

  // Fonction pour supprimer un fichier audio
  async function deleteAudioFile(file) {
    try {
      const path = `${FileSystem.documentDirectory}recordings/${file}`;
      await FileSystem.deleteAsync(path);
      console.log("File deleted:", file);
    } catch (error) {
      console.error("Error deleting audio file:", error);
    }
  }

  return (
    <View style={[styles.item, last === false ? styles.noLast : {} ]}>
      <Text style={styles.fileName} numberOfLines={1}>
        {sound}
      </Text>
      <View style={styles.actions}>
        <Icon
          name="play-circle-outline"
          size={25}
          color={"#6A5ACD"}
          onPress={() => playAudio(sound)}
        />
        {actions == true && (
          <>
            <Icon
              name="trash-outline"
              size={25}
              color={"red"}
              onPress={() => deleteAudioFile(sound)}
            />
            {selectedSound === sound ? (
              <CustomButton
                style={styles.selectedButton}
                titleStyle={styles.selectedButtonTitle}
                title="Déselectionner"
                event={() => handleSelectSound(null)}
              />
            ) : (
              <CustomButton
                style={styles.selectButton}
                titleStyle={styles.selectButtonTitle}
                title="Sélectionner"
                event={() => handleSelectSound(sound)}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  noLast: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  selectButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#6A5ACD",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  selectButtonTitle: {
    color: "#6A5ACD",
  },
  selectedButton: {
    backgroundColor: "#6A5ACD",
    borderWidth: 2,
    borderColor: "#6A5ACD",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  selectedButtonTitle: {
    color: "white",
  },
  fileName: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
