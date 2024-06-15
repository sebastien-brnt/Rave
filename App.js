import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ColorfulTabBar } from 'react-navigation-tabbar-collection';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
import { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

// Import des pages
import HomeScreen from './components/screens/HomeScreen';
import AudioScreen from './components/screens/AudioScreen';
import ConverterScreen from './components/screens/ConverterScreen';

export default function App() {
  const Stack = createNativeStackNavigator(); // Permet de définir la pile de navigation
  const Tab = createBottomTabNavigator(); 

  const [shouldShowTabs, setShouldShowTabs] = useState(false); 

  return (
    // Logique de navigation de l'application :
    //    - 3 écrans : HomeScreen, AudioScreen, ConverterScreen
    //    - Ecran de démarrage : HomeScreen

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
        {shouldShowTabs ? (
            <Tab.Navigator tabBar={(props) => <ColorfulTabBar {...props} />}>
              <Tab.Screen 
                name="Accueil" 
                component={HomeScreen}
                options={{ 
                  headerTitle: "Accueil",
                  tabBarIcon: ({ focused, color, size }) => (
                    <Icon name="home" size={size} color={color} />
                  ),
                }}
              />
              <Tab.Screen 
                name="Audio" 
                component={AudioScreen}
                options={{ 
                  headerTitle: "Audio",
                  tabBarIcon: ({ focused, color, size }) => (
                    <Icon name="playcircleo" size={size} color={color} />
                  ),
                }}
              />
              <Tab.Screen 
                name="Conversion" 
                component={ConverterScreen}
                options={{ 
                  headerTitle: "Conversion",
                  tabBarIcon: ({ focused, color, size }) => (
                    <Icon name="retweet" size={size} color={color} />
                  ),
                }}
              />
            </Tab.Navigator>
          ) : (
            // Afficher un autre composant ou écran si shouldShowTabs est false
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={HomeScreen} />
              {/* Ajoutez d'autres écrans si nécessaire */}
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </PersistGate>
    </Provider>

  );
}