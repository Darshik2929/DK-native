import {PermissionsAndroid} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

export async function requestNotificationPermission() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    {
      title: 'Notification Permission',
      message: 'This app needs notification permission',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  } else {
    Alert.alert('Notification permission not granted');
  }
}

export async function getFCMToken() {
  const token = await messaging().getToken();
  return token;
}
