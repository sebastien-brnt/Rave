import { View, Text } from 'react-native';

export default function ModelSelector() {
    return (
        <View style={styles.container}>
            <Text>Sélection du modèle</Text>
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