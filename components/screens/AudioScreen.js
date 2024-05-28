import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import CustomButton from '../common/CustomButton';

export default function AudioScreen() {
    const [sound, setSound] = useState(null); // Etat pour le son
    const [recording, setRecording] = useState(null); // Etat pour l'enregistrement
    const [recordingUri, setRecordingUri] = useState(null); // Etat pour l'URI de l'enregistrement
    const [permissionResponse, requestPermission] = Audio.usePermissions(); // Etat pour la réponse de la demande de permission

    // Fonction pour démarrer l'enregistrement
    async function startRecording() {
        console.log('Start recording...')
        try {
            // Demander la permission d'accéder au micro si nécessaire
            if (permissionResponse?.status !== 'granted') {
                const response = await requestPermission();
                if (response.status !== 'granted') return;
            }

            // Autoriser l'enregistrement sur iOS
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true, // Autoriser l'enregistrement sur iOS
                playsInSilentModeIOS: true, // Jouer le son en mode silencieux sur iOS
            });

            // Commencer l'enregistrement
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);

        } catch (error) {
            console.error(error);
        }
    }

    // Fonction pour arrêter l'enregistrement
    async function stopRecording() {
        console.log('Stop recording...')
        try {
            if (!recording) return;
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false, // Désactiver l'enregistrement sur iOS
            });
            const uri = recording.getURI();
            setRecordingUri(uri);
            setRecording(null);
        } catch (error) {
            console.error(error);
        }
    }

    // Fonction pour jouer le son
    async function playSound() {
        try {
            if (!recordingUri) return;

            // Configuration de l'audio
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true, // Jouer le son en mode silencieux sur iOS
            });

            // Création de l'audio
            const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
            setSound(sound);
            console.log('Playing Sound...');
            await sound.playAsync();

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        return sound ? () => {
            // Libérer la mémoire allouée à l'audio précédent
            console.log('Unloading Sound...');
            sound.unloadAsync();
        } : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enregistrement d'un audio</Text>

            <View style={styles.row}>
                {/* Bouton de démarrage et d'arrêt et de lecture de l'enregistrement */}
                <TouchableOpacity style={styles.recordingButton} onPress={startRecording}>
                    <Image 
                        source={require('../../assets/play.png')}
                        style={{width: 45, height: 60, alignItems: 'center', justifyContent: 'center'}}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.recordingButton} onPress={stopRecording}>
                    <Image 
                        source={require('../../assets/stop.png')}
                        style={{width: 50, height: 50}}
                    />
                </TouchableOpacity>
            </View>

            {/* Affichage du bouton de lecture si un audio a été enregistré */}
            {recordingUri && <CustomButton title="Lire l'enregistrement" event={playSound} />}

            <Text style={styles.titleSecond}>Sauvegarde dans le téléphone</Text>

            {/* Champs de saisie du nom de l'audio à enregistrer */}
            <TextInput placeholder="Nom du fichier audio" style={styles.fileName}/>

            {/* Bouton d'enregistrement de l'audio */}
            <CustomButton style={styles.buttonSave} title="Sauvegarder l'audio" event={() => {}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        marginBottom: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    titleSecond: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 20,
    },
    fileName: {
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10
    },
    recordingButton: {
        padding: 20,
        borderRadius: 10,
        flex: 1,
        borderWidth: 2,
        borderColor: '#6A5ACD',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
