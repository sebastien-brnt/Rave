import { View, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';

export default function CustomButton({ title, event, style, titleStyle }) {
    return (
        <View>
            <TouchableOpacity style={[styles.button, style]} onPress={event}>
                <Text style={[styles.title, titleStyle]}>{title}</Text>
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
        textAlign: 'center'
    }
});
