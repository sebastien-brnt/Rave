import { View, StyleSheet, Text } from "react-native";
import CustomButton from "../common/CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { selectSound, deselectSound, selectedSoundSelector, removeSound } from "../slices/SoundSlice"; // Correction du nom de slice
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/Ionicons";

export default function ItemSound({
  sound,
  actions = true,
  play = true,
  deleting = true,
  select = true,
  last = false,
  converted = false,
  directory = "recordings",
}) {
  const dispatch = useDispatch();
  const selectedSound = useSelector(selectedSoundSelector);

  // Fonction pour lire un fichier audio
  async function playAudio(file) {
    let path = "";
    if (converted === true) {
      path = `${FileSystem.documentDirectory}convertedSound/${file}`;
    } else {
      path = `${FileSystem.documentDirectory}${directory}/${file.fileName}`;
    }

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
  async function handleSelectSound(sound) {
    dispatch(sound ? selectSound(sound) : deselectSound());
  }

  // Fonction pour supprimer un fichier audio
  async function deleteAudioFile(file) {
    try {
      // Suppression du fichier audio dans le téléphone
      const path = `${FileSystem.documentDirectory}${directory}/${file.fileName}`;
      await FileSystem.deleteAsync(path);

      // Suppression du son du store
      dispatch(removeSound(file));
    } catch (error) {
      console.error("Error deleting audio file:", error);
    }
  }

  return (
    <View style={[styles.item, last === false ? styles.noLast : {}]}>
      { converted ? 
      <Text style={styles.fileName} numberOfLines={1}>
        sound.wav
      </Text>
      :
      <Text style={styles.fileName} numberOfLines={1}>
        {sound.name}
      </Text>
      }
      <View style={styles.actions}>
        <Icon
          name="play-circle-outline"
          size={25}
          color={"#6A5ACD"}
          onPress={() => playAudio(sound)}
        />
        {actions == true && (
          <>
            {deleting == true && (
              <>
                <Icon
                  name="trash-outline"
                  size={25}
                  color={"red"}
                  onPress={() => deleteAudioFile(sound)}
                />
              </>
            )}
            {select == true && (
              <>
                {selectedSound && selectedSound.fileName === sound.fileName ? (
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
