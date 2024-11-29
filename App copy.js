import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigation from './src/navigation/AppNavigation';
import LoginScreen from './src/screens/Login/Login';
import {
  requestUserPermission,
  handleNotificationListeners,
  createNotificationChannel,
} from './FCMService'; // Import FCM functions

const RootNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const clientId = await AsyncStorage.getItem('client_id');
        if (clientId) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log('Error reading client_id from AsyncStorage', e);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
    createNotificationChannel();
    requestUserPermission();
    handleNotificationListeners();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppNavigation />
      ) : (
        <LoginScreen setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
};

export default RootNavigation;
