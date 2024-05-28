import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';

export default function CustomButton({ title, event, style }) {
    return (
        <View style={style}>
            <TouchableOpacity style={styles.button} onPress={event}>
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#6A5ACD',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 100,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
    }
});
