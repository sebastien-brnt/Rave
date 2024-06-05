import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import CustomButton from '../common/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';


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

    // Fonction pour lire un fichier Audio
    async function playAudio(file) {
        // Path du fichier audio
        const path = `${FileSystem.documentDirectory}recordings/${file}`;

        // Création d'un objet audio
        const { sound } = await Audio.Sound.createAsync(
            { uri: path }
        );

        // Lecture du fichier audio
        await sound.playAsync();
    }

    // Chargement des fichiers audio
    useEffect(() => {
        const focusListener = () => {
            loadAudioFiles();
        };

        // Ajout d'un listener pour recharger les fichiers lorsque l'écran devient actif
        const unsubscribe = navigation.addListener('focus', focusListener);

        // Nettoyage du listener lors du démontage du composant
        return unsubscribe;
    }, [navigation]);

    
    return (
        <View style={styles.container}>
            <Text style={styles.title} >Sélection de l'audio</Text>

            {/* Liste des fichiers audio */}
            {audioFiles.map((file, index) => (
                <View key={index} style={styles.item} >
                    <Text>{file}</Text>
                    <CustomButton title="Lire" event={() => playAudio(file)} />
                    <CustomButton title="Supprimer" event={() => deleteAudioFile(file)}/>
                </View>
            ))}
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        padding: 30
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        gap: 20
    },
};