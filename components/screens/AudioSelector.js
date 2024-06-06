import { View, Text, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import CustomButton from '../common/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { selectSound, selectedSoundSelector } from '../slices/SoundSlice';


export default function AudioSelector() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [ selectedSound, setSelectedSound ] = useState(null);
    const [ search, setSearch ] = useState("");
    const [ searchResult, setSearchResult ] = useState(null);

    // State pour stocker la liste des fichiers audio
    const [audioFiles, setAudioFiles] = useState([]);

    // Fonction pour récupérer la liste des fichiers audio
    async function loadAudioFiles() {
        try {
            // Path du dossier d'enregistrement
            const directory = `${FileSystem.documentDirectory}recordings/`;
            const files = await FileSystem.readDirectoryAsync(directory);
            setAudioFiles(files);
        } catch (error) {
            console.error('Error loading audio files:', error);
        }
    }

    // Fonction pour supprimer un fichier audio
    async function deleteAudioFile(file) {
        try {
            // Path du fichier à supprimer
            const path = `${FileSystem.documentDirectory}recordings/${file}`;
            await FileSystem.deleteAsync(path);
            console.log('File deleted:', file);
            loadAudioFiles();
        } catch (error) {
            console.error('Error deleting audio file:', error);
        }
    }

    // Fonction pour lire un fichier Audio
    async function playAudio(file) {
        // Path du fichier audio
        const path = `${FileSystem.documentDirectory}recordings/${file}`;

        // Création d'un objet audio
        const { sound } = await Audio.Sound.createAsync(
            { uri: path }
        );

        // Lecture du fichier audio
        await sound.playAsync();
    }

    // Fonction pour selectionner le fichier audio dans le SoundSlice
    async function selectAudio(file) {
        // Path du fichier audio
        const path = `${FileSystem.documentDirectory}recordings/${file}`;

        // Création d'un objet audio
        const { sound } = await Audio.Sound.createAsync(
            { uri: path }
        );

        // Enregistrement du fichier audio selectionné dans le SoundSlice
        dispatch(selectSound(sound));
        setSelectedSound(file);
    }

    // Fonction pour désélectionner le fichier audio dans le SoundSlice
    async function deselectAudio() {
        dispatch(selectSound(null));
        setSelectedSound(null);
    }

    // Fonction pour récupérer le fichier audio sélectionné dans le SoundSlice
    async function getSelectedAudio() {
        // Récupération du fichier audio sélectionné
        const selectedAudio = useSelector(selectedSoundSelector);
        setSelectedSound(selectedAudio);
    }

    // Fonction pour rechercher un fichier audio 
    async function searchAudio() {
        // Path du dossier d'enregistrement
        const directory = `${FileSystem.documentDirectory}recordings/`;
        const files = await FileSystem.readDirectoryAsync(directory);

        // Clean de la recherche
        const cleanSearch = search.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        const filteredFiles = files.filter(file => file.replace(/[^a-z0-9]/gi, '_').toLowerCase().includes(cleanSearch));
        setSearchResult(filteredFiles[0]);
    }


    // Chargement des fichiers audio
    useEffect(() => {
        const focusListener = () => {
            loadAudioFiles();
            getSelectedAudio();
        };

        // Ajout d'un listener pour recharger les fichiers lorsque l'écran devient actif
        const unsubscribe = navigation.addListener('focus', focusListener);

        // Nettoyage du listener lors du démontage du composant
        return unsubscribe;
    }, [navigation]);

    // Recherche des fichiers audio
    useEffect(() => {
        searchAudio();
    }, [search]);

    
    return (
        <View style={styles.container}>
            <Text style={styles.title} >Sélection de l'audio</Text>

            {/* Liste des fichiers audio */}
            {audioFiles.map((file, index) => (
                <View key={index} style={styles.item} >
                    <Text style={styles.fileName} numberOfLines={1} >{file}</Text>
                    <View style={styles.actions}>
                        <Icon name="play-circle-outline" size={25} color={'#6A5ACD'} onPress={() => playAudio(file)} />
                        <Icon name="trash-outline" size={25} color={'red'} onPress={() => deleteAudioFile(file)} />
                        { selectedSound === file ? 
                        <CustomButton style={styles.selectedButton} titleStyle={styles.selectedButtonTitle} title="Déselectionner" event={() => deselectAudio()} />
                        :
                        <CustomButton style={styles.selectButton} titleStyle={styles.selectButtonTitle} title="Sélectionner" event={() => selectAudio(file)} /> }
                    </View>
                </View>
            ))}

            {/* Barre de recherche */}
            <Text style={styles.titleSecond} >Rechercher un audio enregistré</Text>
            
            <View style={styles.searchBar}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Rechercher un fichier audio"
                    value={search}
                    onChangeText={setSearch}
                />
                <Icon name="search" size={25} color={'#6A5ACD'} />
            </View>

            {/* Résultat de la recherche */}
            { search && searchResult ?
                <View>
                    <Text style={styles.resultTitle}>Meilleur résultat :</Text>

                    <View style={styles.item} >
                        <Text style={styles.fileName} numberOfLines={1} >{searchResult}</Text>
                        <View style={styles.actions}>
                            <Icon name="play-circle-outline" size={25} color={'#6A5ACD'} onPress={() => playAudio(searchResult)} />
                            <Icon name="trash-outline" size={25} color={'red'} onPress={() => deleteAudioFile(searchResult)} />
                            { selectedSound === searchResult ? 
                            <CustomButton style={styles.selectedButton} titleStyle={styles.selectedButtonTitle} title="Déselectionner" event={() => deselectAudio()} />
                            :
                            <CustomButton style={styles.selectButton} titleStyle={styles.selectButtonTitle} title="Sélectionner" event={() => selectAudio(searchResult)} /> }
                        </View>
                    </View> 
                </View> 
                :
                search && !searchResult && <Text style={styles.noResult}>Aucun fichier audio trouvé</Text>
            }
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
    titleSecond: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 40,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        gap: 20
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    selectButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#6A5ACD',
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    selectButtonTitle: {
        color: '#6A5ACD'
    },
    selectedButton: {
        backgroundColor: '#6A5ACD',
        borderWidth: 2,
        borderColor: '#6A5ACD',
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    selectedButtonTitle: {
        color: 'white'
    },
    fileName: {
        flex: 1
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 10,
        padding: 10,
        marginTop: 20
    },
    searchInput: {
        flex: 1
    },
    noResult: {
        marginTop: 20,
        textAlign: 'center'
    },
    resultTitle: {
        fontWeight: 'bold',
        marginTop: 20
    }
};