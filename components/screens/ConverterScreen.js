import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';

export default function ConverterScreen() {
    const [recordings, setRecordings] = useState([])

    // Fonction pour récupérer les enregistrements
    async function getRecordings() {
        try {
            // Path du dossier d'enregistrement
            const directory = `${FileSystem.documentDirectory}recordings/`;

            // Vérification de l'existence du dossier
            const dirInfo = await FileSystem.getInfoAsync(directory);
            if (!dirInfo.exists) {
                console.log('No recordings directory found');
                return [];
            }

            // Lire le contenu du dossier
            const files = await FileSystem.readDirectoryAsync(directory);

            // Générer les URI des fichiers
            const recordings = files.map(file => ({
                name: file,
                uri: `${directory}${file}`
            }));

            console.log('Recordings retrieved:', recordings);
            setRecordings(recordings); // Sauvegarde des records
        } catch (error) {
            console.error('Error retrieving recordings:', error);
        }
    }

    useEffect(() => {
        // Récupération des records
        getRecordings();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Conversion de l'audio</Text>
            <Text>Étape 1</Text>
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