import { View, Text, TextInput, ScrollView, FlatList } from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import ItemSound from "../sound/ItemSound";
import { useSelector } from "react-redux";
import { soundsSelector } from "../slices/SoundSlice";

export default function AudioSelectorScreen() {
  // State pour la recherche
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // State pour stocker la liste des fichiers audio
  const audioFiles = useSelector(soundsSelector);

  // Fonction pour rechercher un fichier audio
  async function searchAudio() {
    // Clean de la recherche
    const cleanSearch = search.replace(/[^a-z0-9]/gi, "-").toLowerCase();

    const filteredFiles = audioFiles.filter((file) =>
      file.fileName
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()
        .includes(cleanSearch)
    );
    setSearchResult(filteredFiles[0]);
  }

  // Recherche des fichiers audio
  useEffect(() => {
    searchAudio();
  }, [search]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Sélection de l'audio</Text>

        {/* Barre de recherche */}
        <Text style={styles.titleSecond}>Rechercher un audio enregistré</Text>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un fichier audio"
            value={search}
            onChangeText={setSearch}
          />
          <Icon name="search" size={25} color={"#6A5ACD"} />
        </View>

        {/* Résultat de la recherche */}
        {search && searchResult ? (
          <View style={styles.bestResult}>
            {/* Item du son résultat de la recherche */}
            <ItemSound sound={searchResult} last={true} />
          </View>
        ) : (
          search &&
          !searchResult && (
            <Text style={styles.noResult}>Aucun fichier audio trouvé</Text>
          )
        )}

        {/* Liste des fichiers audio */}
        <Text style={styles.titleList}>Liste des audios enregistrés</Text>
        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item.fileName}
          renderItem={({ item, index }) => (
            <ItemSound sound={item} last={index === audioFiles.length - 1} />
          )}
        />
      </View>
    </ScrollView>
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
  },
  titleSecond: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
  },
  titleList: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
  },
  noResult: {
    marginTop: 20,
    textAlign: "center",
  },
  resultTitle: {
    fontWeight: "bold",
    marginTop: 20,
  },
  bestResult: {
    marginTop: 10,
    backgroundColor: "#ddd",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
};
