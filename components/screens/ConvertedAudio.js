import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function ConvertedAudio() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title} >Audio convertis enregistrés</Text>
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