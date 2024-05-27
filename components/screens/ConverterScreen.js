import { View, Text, StyleSheet } from 'react-native';

export default function ConverterScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Conversion de l'audio</Text>
            <Text>Étape 1</Text>
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