import React from "react";
import Swiper from "react-native-screens-swiper";
import AudioSelectorScreen from "../screens/AudioSelectorScreen";
import ConversionScreen from "../screens/ConversionScreen";
import ConvertedAudioListScreen from "../screens/ConvertedAudioListScreen";


export default function ConverterNavigation() {
    const data = [
        {
            component: () => <AudioSelectorScreen />,
            tabLabel: "Sélection Audio",
        },
        {
            component: () => <ConversionScreen />,
            tabLabel: "Sélection Modèle",
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

// more about styling below
const styles = {
    borderActive: {
        borderColor: '#6A5ACD',
    },
    pillLabel: {
        color: 'gray',
    },
    activeLabel: {
        color: '#6A5ACD',
    },
};