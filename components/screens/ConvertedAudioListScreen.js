import { View, Text, FlatList } from "react-native";
import ItemSound from "../sound/ItemSound";
import { useSelector } from "react-redux";
import { convertedSoundsSelector } from "../slices/ConvertedSoundSlice";

export default function ConvertedAudioListScreen() {
  const audioFiles = useSelector(convertedSoundsSelector);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audios convertis enregistrés</Text>
      {/* Liste des fichiers audio */}
      {audioFiles && audioFiles.length === 0 && <Text>Aucun fichier audio enregistré</Text>}
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
