import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';


export default function AudioSelector() {
    // State pour stocker la liste des fichiers audio
    const [audioFiles, setAudioFiles] = useState([]);

    // Fonction pour récupérer la liste des fichiers audio
    async function loadAudioFiles() {
        try {
            // Path du dossier d'enregistrement
            const directory = `${FileSystem.documentDirectory}recordings/`;
            const files = await FileSystem.readDirectoryAsync(directory);
            setAudioFiles(files);
        } catch (error) {
            console.error('Error loading audio files:', error);
        }
    }

    // Chargement des fichiers audio
    useEffect(() => {
        loadAudioFiles();
        console.log('Audio files loaded', audioFiles);
    }, []);
    
    return (
        <View style={styles.container}>
            <Text>Sélection de l'audio</Text>

            {/* Liste des fichiers audio */}
            {audioFiles.map((file, index) => (
                <Text key={index}>{file}</Text>
            ))}
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
};