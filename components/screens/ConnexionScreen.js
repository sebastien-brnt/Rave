import { View, StyleSheet, TextInput, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../common/CustomButton';
import { setServerPort, setServerIp , setConnected, setDisconnected, isConnectedSelector } from '../slices/ServerSlice';

export default function ConnexionScreen() {
    const navigation = useNavigation();
    const [ip, setIp] = useState(''); // IP du serveur
    const [port, setPort] = useState(''); // Port du serveur
    const dispatch = useDispatch();

    // Récupération de l'état de la connexion
    const isConnected = useSelector(isConnectedSelector);

    async function isAvailable() {
        try {
            const response = await fetch(`http://${ip}:${port}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const textResponse = await response.text();
            if (textResponse.includes('Connexion sucess !')) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    async function checkConnexion() {        
        // Vérification de la connexion
        if (await isAvailable()) {
            // Affichage d'un toast de succès
            Toast.show({
                type: 'success',
                text1: 'Connexion réussie',
                text2: 'Nous avons réussi à nous connecter à serveur.'
            });

            // Ajout du serveur à la liste des serveurs
            await dispatch(setServerPort(port));
            await dispatch(setServerIp(ip));
            await dispatch(setConnected());
        } else {
            // Affichage un toast d'erreur
            Toast.show({
              type: 'error',
              text1: 'Erreur lors de la connexion',
              text2: 'Veuillez vérifier les informations de connexion saisies.'
            });

            dispatch(setDisconnected());
        }
    }

    useEffect(() => {
        // Vérification de la connexion au serveur et redirection de l'utilisateur
        if (isConnected) {
            navigation.navigate('Audio');
        }
    });

    return (
        <View style={styles.container}>
            <Toast />

            {/* Titre de l'application */}
            <Image 
                source={require('../../assets/logo-rave.png')}
                style={styles.logo}
            />
            
            {/* Champs de saisie pour l'IP */}
            <TextInput 
                style={styles.input} 
                placeholder="IP du serveur"
                onChangeText={setIp}
                />
            
            {/* Champs de saisie du port */}
            <TextInput 
                style={styles.input} 
                placeholder="Port du serveur" 
                onChangeText={setPort}
                />

            {/* Bouton de test de connexion */}
            <CustomButton style={styles.button} title="Tester la connexion" event={checkConnexion} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -50 }],
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 5,
        width: 200,
        padding: 10,
        marginVertical: 5,
    },
    button: {
        marginVertical: 15,
    },
    logo: {
        height: 100, 
        objectFit: 'contain',
        marginBottom: 30
    }
});
