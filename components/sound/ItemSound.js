import * as FileSystem from "expo-file-system";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectSound, deselectSound, selectedSoundSelector, removeSound } from "../slices/SoundSlice"; // Correction du nom de slice
import { removeConvertedSound } from "../slices/ConvertedSlice";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";
import CustomButton from "../common/CustomButton";
import { useEffect, useState } from "react";

export default function ItemSound({
  sound,
  actions = true,
  play = true,
  slice = "SoundSlice",
  deleting = true,
  select = true,
  last = false,
  converted = false,
  directory = "recordings",
}) {
  const dispatch = useDispatch();
  const selectedSound = useSelector(selectedSoundSelector);
  const [playbackSound, setPlaybackSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fonction pour lire un fichier audio
  async function playAudio(file) {
    let path = "";
    if (converted) {
      path = `${FileSystem.documentDirectory}convertedSound/${file}`;
    } else {
      path = `${FileSystem.documentDirectory}${directory}/${file.fileName}`;
    }

    // Configuration de l'audio
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true, // Jouer le son en mode silencieux sur iOS
    });

    if (playbackSound) {
      if (isPlaying) {
        await playbackSound.pauseAsync();
        setIsPlaying(false);
      } else {
        await playbackSound.playAsync();
        setIsPlaying(true);
      }
    } else {
      const { sound } = await Audio.Sound.createAsync({
        uri: path,
      });
      setPlaybackSound(sound);
      await sound.playAsync();
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          resetAudioState();
        }
      });
    }
  }

  // Fonction pour réinitialiser l'état de l'audio
  function resetAudioState() {
    setPlaybackSound(null);
    setIsPlaying(false);
  };

  // Effet pour décharger le son lorsqu'il n'est plus utilisé
  useEffect(() => {
    return playbackSound
      ? () => {
          playbackSound.unloadAsync();
        }
      : undefined;
  }, [playbackSound]);


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

      if (slice === "SoundSlice") {
        // Suppression du son du store
        dispatch(removeSound(file));
      } else if (slice === "ConvertedSlice") {
        // Suppression du son du store
        dispatch(removeConvertedSound(file));
      }
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
          name={isPlaying ? 'pause-circle-sharp' : 'play-circle-outline' }
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
