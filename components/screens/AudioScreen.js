import { View, Text, StyleSheet, Button, TextInput } from 'react-native';

export default function AudioScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enregistrement d'un audio</Text>

            {/* Bouton de démarrage et d'arrêt de l'enregistrement */}
            <Button title="Démarrer l'enregistrement" onPress={() => {}} />
            <Button title="Arrêter l'enregistrement" onPress={() => {}} />

            {/* Champs de saisie du nom de l'audio à enregistrer */}
            <TextInput placeholder="Nom du fichier audio" />

            {/* Bouton d'enregistrement de l'audio */}
            <Button title="Enregistrer l'audio" onPress={() => {}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});