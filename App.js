import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Import des pages
import HomeScreen from './components/screens/HomeScreen';

export default function App() {
  const Stack = createNativeStackNavigator(); // Permet de définir la pile de navigation

  return (
    // Logique de navigation de l'application :
    //    - 1 écrans : HomeScreen
    //    - Ecran de démarrage : HomeScreen

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerTitleStyle: styles.title }}>

            <Stack.Screen 
              name="Accueil" 
              component={HomeScreen}
              options={{ headerTitle: "Accueil" }}>
            </Stack.Screen>

          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>

  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
    color: '#000',
  }
});