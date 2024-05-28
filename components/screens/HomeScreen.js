import { View, Text, StyleSheet, TextInput, Button, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { addServer } from '../slices/ServerSlice';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../common/CustomButton';


export default function HomeScreen() {
    const navigation = useNavigation();
    const [ip, setIp] = useState(''); // IP du serveur
    const [port, setPort] = useState(''); // Port du serveur

    async function isAvailable() {
        try {
            const response = await fetch(`http://${ip}:${port}`);
            if (response.ok) {
              console.log('Connexion réussie');
              return true;
            } else {
              console.error('Échec de la connexion. Statut de la réponse :', response.status);
              return false;
            }
          } catch (error) {
            console.error('Erreur lors de la connexion au serveur :', error);
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

            // Redirection vers la page d'enregistrement des audios
            navigation.navigate('Audio');

            // Ajout du serveur à la liste des serveurs
            // const dispatch = useDispatch();
            // dispatch (addServer({ip: ip, port: port}));
        } else {
            // Affichage un toast d'erreur
            Toast.show({
              type: 'error',
              text1: 'Erreur lors de la connexion',
              text2: 'Veuillez vérifier les informations de connexion saisies.'
            });
        }
    }

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
                placeholder="IP su serveur"
                onChangeText={setIp}
                />
            
            {/* Champs de saisie du port */}
            <TextInput 
                style={styles.input} 
                placeholder="Port su serveur" 
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
        marginVertical: 15
    },
    logo: {
        height: 100, 
        objectFit: 'contain',
        marginBottom: 30
    }
});