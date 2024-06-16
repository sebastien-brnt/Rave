import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { store, persistor } from "./store/store";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ColorfulTabBar } from "react-navigation-tabbar-collection";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/AntDesign";

// Import des pages
import ConnexionScreen from "./components/screens/ConnexionScreen";
import AudioScreen from "./components/screens/AudioScreen";
import ConverterNavigation from "./components/navigation/ConverterNavigation";

// Import des sélecteurs
import { isConnectedSelector } from "./components/slices/ServerSlice";

const Stack = createNativeStackNavigator(); // Permet de définir la pile de navigation
const Tab = createBottomTabNavigator();

function AppNavigator() {
  // Logique de navigation de l'application :
  //    - 3 écrans : ConnexionScreen, AudioScreen, ConverterNavigation
  //    - Ecran de démarrage : ConnexionScreen

  // Récupération de l'état de connexion au serveur
  const isConnected = useSelector(isConnectedSelector);
  const [shouldShowTabs, setShouldShowTabs] = useState(false);

  // Vérification de la connexion au serveur
  useEffect(() => {
    if (!isConnected) {
      setShouldShowTabs(false);
    } else {
      setShouldShowTabs(true);
    }
  }, [isConnected]);

  return (
    <NavigationContainer>
      {shouldShowTabs ? (
        <Tab.Navigator tabBar={(props) => <ColorfulTabBar {...props} />}>
          <Tab.Screen
            name="Audio"
            component={AudioScreen}
            options={{
              headerTitle: "Audio",
              tabBarIcon: ({ color, size }) => (
                <Icon name="playcircleo" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Conversion"
            component={ConverterNavigation}
            options={{
              headerTitle: "Conversion",
              tabBarIcon: ({ color, size }) => (
                <Icon name="retweet" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        // Afficher un autre composant ou écran si shouldShowTabs est false
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={ConnexionScreen} />
          {/* Ajoutez d'autres écrans si nécessaire */}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
