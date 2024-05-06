import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ColorfulTabBar } from 'react-navigation-tabbar-collection';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
import Icon from 'react-native-vector-icons/AntDesign';

// Import des pages
import HomeScreen from './components/screens/HomeScreen';
import AudioScreen from './components/screens/AudioScreen';

export default function App() {
  const Stack = createNativeStackNavigator(); // Permet de définir la pile de navigation
  const Tab = createBottomTabNavigator(); 

  return (
    // Logique de navigation de l'application :
    //    - 2 écrans : HomeScreen, AudioScreen
    //    - Ecran de démarrage : HomeScreen

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
        <Tab.Navigator
                tabBar={(props) => <ColorfulTabBar {...props} />} >
            <Tab.Screen 
              name="Accueil" 
              component={HomeScreen}
              options={{ 
                headerTitle: "Accueil",
                icon: ({ focused, color, size }) => (
                  <Icon name="home" size={size} color={color} />
                ),
              }}>
            </Tab.Screen>

            <Tab.Screen 
              name="Audio" 
              component={AudioScreen}
              options={{ 
                headerTitle: "Audio",
                icon: ({ focused, color, size }) => (
                  <Icon name="playcircleo" size={size} color={color} />
                ),
              }}>
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>

  );
}