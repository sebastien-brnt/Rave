import React from "react";
import Swiper from "react-native-screens-swiper";
import AudioSelectorScreen from "../screens/AudioSelectorScreen";
import ConversionScreen from "../screens/ConversionScreen";
import ConvertedAudioListScreen from "../screens/ConvertedAudioListScreen";


export default function ConverterNavigation() {
    // Logique de navigation de ConverterNavigation :
    //    - 3 écrans : AudioSelectorScreen, ConversionScreen, ConvertedAudioListScreen

    // Navigation entre les écrans de sélection audio, conversion audio et liste des audios convertis
    const data = [
        {
            component: () => <AudioSelectorScreen />,
            tabLabel: "Sélection Audio",
        },
        {
            component: () => <ConversionScreen />,
            tabLabel: "Conversion Audio",
        },
        {
            component: () => <ConvertedAudioListScreen />,
            tabLabel: "Audios enregistrés",
        },
    ];

    return (
        <Swiper
            data={data}
            isStaticPills={true}
            style={styles}
        />
    );
}

// Styles de la barre de navigation du swiper
const styles = {
    borderActive: {
        borderColor: '#6A5ACD',
    },
    pillLabel: {
        color: "#6A5ACD", 
        height: 20
    },
    activeLabel: {
        color: '#6A5ACD',
    },
    staticPillsContainer: {
        height: 35,
    }
};