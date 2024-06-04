import { View, Text } from 'react-native';

export default function AudioSelector() {
    return (
        <View style={styles.container}>
            <Text>Sélection de l'audio</Text>
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