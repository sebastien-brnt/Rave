import { View, StyleSheet, Text } from "react-native";
import CustomButton from "../common/CustomButton";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";
import { selectModel, deselectModel, selectedModelSelector } from "../slices/ModelSlice";

export default function ItemModel({ model }) {
  const dispatch = useDispatch();
  // Récupération du modèle sélectionné dans le store
  const selectedModel = useSelector(selectedModelSelector);

  async function selectModelInServer(modelName) {
    // Enregistrement du modèle sélectionné dans le store
    dispatch(modelName ? selectModel(modelName) : deselectModel());

    try {
      // Envoi de la requête pour sélectionner le modèle
      const response = await fetch(
        `http://192.168.1.13:8000/selectModel/${modelName}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.text();

      // Affichage du message de succès si le modèle a bien été sélectionné
      if (data.includes("selected")) {
        console.log("Model selected:", modelName);
        Toast.show({
          type: "success",
          text1: "Modèle sélectionné",
          text2: `Le modèle ${modelName} a été sélectionné`,
        });
      }
    } catch (error) {
      // Affichage du message d'erreur si le modèle n'a pas pu être sélectionné
      console.error("Error selecting model:", error);
    }
  }

  return (
    <View style={styles.model}>
      <Text>{model}</Text>
      {selectedModel === model ? (
        <CustomButton
          style={styles.selectedButton}
          titleStyle={styles.selectedButtonTitle}
          title="Déselectionner"
          event={() => selectModelInServer(null)}
        />
      ) : (
        <CustomButton
          style={styles.selectButton}
          titleStyle={styles.selectButtonTitle}
          title="Sélectionner"
          event={() => selectModelInServer(model)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  model: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
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
});
