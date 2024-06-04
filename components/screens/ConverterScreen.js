import React from "react";
import Swiper from "react-native-screens-swiper";
import AudioSelector from "./AudioSelector";
import ModelSelector from "./ModelSelector";
import ConvertedAudio from "./ConvertedAudio";


export default function ConverterScreen() {
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
            component: () => <ConvertedAudio />,
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