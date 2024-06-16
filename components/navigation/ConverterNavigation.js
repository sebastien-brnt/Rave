import React from "react";
import Swiper from "react-native-screens-swiper";
import AudioSelector from "../screens/AudioSelector";
import ModelSelector from "../screens/ModelSelector";
import ConvertedAudioList from "../screens/ConvertedAudioList";


export default function ConverterNavigation() {
    const data = [
        {
            component: () => <AudioSelector />,
            tabLabel: "Sélection Audio",
        },
        {
            component: () => <ModelSelector />,
            tabLabel: "Sélection Modèle",
        },
        {
            component: () => <ConvertedAudioList />,
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