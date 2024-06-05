import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import CustomButton from '../common/CustomButton';
import { useNavigation } from '@react-navigation/native';


export default function AudioSelector() {
    const navigation = useNavigation();

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

    // Fonction pour supprimer un fichier audio
    async function deleteAudioFile(file) {
        try {
            // Path du fichier à supprimer
            const path = `${FileSystem.documentDirectory}recordings/${file}`;
            await FileSystem.deleteAsync(path);
            console.log('File deleted:', file);
            loadAudioFiles();
        } catch (error) {
            console.error('Error deleting audio file:', error);
        }
    }

    // Chargement des fichiers audio
    useEffect(() => {
        loadAudioFiles();
        console.log('Audio files loaded', audioFiles);
    }, []);

    useEffect(() => {
        const focusListener = () => {
            loadAudioFiles();
        };

        // Ajoutez un listener pour recharger les fichiers lorsque l'écran devient actif
        const unsubscribe = navigation.addListener('focus', focusListener);

        // Cleanup le listener lors du démontage du composant
        return unsubscribe;
    }, [navigation]);

    
    return (
        <View style={styles.container}>
            <Text>Sélection de l'audio</Text>

            {/* Liste des fichiers audio */}
            {audioFiles.map((file, index) => (
                <View key={index}>
                    <Text>{file}</Text>
                    <CustomButton title="Supprimer" event={() => deleteAudioFile(file)} />
                </View>
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