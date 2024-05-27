import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export default function AudioScreen() {
    const [sound, setSound] = useState(null); // Etat pour le son
    const [recording, setRecording] = useState(null); // Etat pour l'enregistrement
    const [recordingUri, setRecordingUri] = useState(null); // Etat pour l'URI de l'enregistrement
    const [permissionResponse, requestPermission] = Audio.usePermissions(); // Etat pour la réponse de la demande de permission

    // Fonction pour démarrer l'enregistrement
    async function startRecording() {
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

            {/* Bouton de démarrage et d'arrêt et de lecture de l'enregistrement */}
            <Button title="Démarrer l'enregistrement" onPress={startRecording} />
            <Button title="Arrêter l'enregistrement" onPress={stopRecording} />

            {/* Affichage du bouton de lecture si un audio a été enregistré */}
            {recordingUri && <Button title="Lire l'enregistrement" onPress={playSound} />}

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
