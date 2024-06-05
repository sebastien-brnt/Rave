import { View, Text } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function ModelSelector() {
    const navigation = useNavigation();

    // statepour stocker le modèle sélectionné
    const [model, setModel] = useState(null);

    return (
        <View style={styles.container}>
            <Text style={styles.title} >Sélection du model</Text>
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
};