import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../common/CustomButton';
import Toast from 'react-native-toast-message';
import * as FileSystem from 'expo-file-system';


export default function ModelSelector() {
    const navigation = useNavigation();

    // state pour stocker le modèle sélectionné
    const [model, setModel] = useState(null);
    const [fileName, setFileName] = useState("");


    // Fonction de sauvegarde de l'audio converti dans le téléphone
    async function saveConvertedSound() {
        if (!fileName) {
            console.log('Saving error, no record or file name')
            Toast.show({
                type: 'error',
                text1: 'Erreur d\'enregistrement',
                text2: 'Aucun audio ou nom de fichier'
            });
            return;
        }

        try {
            // Path du dossier d'enregistrement des audios convertis
            const directory = `${FileSystem.documentDirectory}convertedSound/`;

            // Création du sous-dossier s'il n'existe pas
            const dirInfo = await FileSystem.getInfoAsync(directory);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
            }

            // Slugify du nom du fichier
            const cleanFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

            // URI
            const fileUri = `${directory}${cleanFileName}.m4a`;
            
            // Vérification de l'existence du fichier
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (fileInfo.exists) {
                Toast.show({
                    type: 'error',
                    text1: 'Erreur d\'enregistrement',
                    text2: 'Le nom du fichier est déjà utilisé'
                });
                return;
            }

            // Enregistrement
            await FileSystem.moveAsync({
                to: fileUri
            });

            console.log('Recording saved to:', fileUri);
            setFileName(''); // Réinitialise le nom du fichier après la sauvegarde
        } catch (error) {
            console.error('Error saving recording:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title} >Sélection du model</Text>
                
            {/* Liste des modèles */}

            {/* Bouton de conversion */}
            <CustomButton title="Convertir l'audio" />

            {/* Récapitulatif de l'audio d'origine et celui converti */}
            <Text style={styles.titleSecond}>Récapitulatif</Text>
            <Text>Audio d'origine: </Text>
            <Text>Audio converti: </Text>

            {/* Enregistrement de l'audio converti */}
            <Text style={styles.titleSecond}>Enregistrer l'audio converti</Text>
            <TextInput 
                placeholder="Nom du fichier" 
                style={styles.fileName}
                onChangeText={setFileName}
                value={fileName}
                />
            <CustomButton title="Enregistrer l'audio converti" event={() => saveConvertedSound()}/>
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
    titleSecond: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10
    },
    fileName: {
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 13,
        borderRadius: 10
    },
};