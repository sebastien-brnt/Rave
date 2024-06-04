import { View, Text } from 'react-native';

export default function AudioSelector() {
    return (
        <View style={styles.container}>
            <Text>Audios convertis enregistrés</Text>
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