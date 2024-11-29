import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {useState} from 'react';

export async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      let token;

      if (enabled) {
            console.log('Authorization status:', authStatus);
            token = getFCMToken();
      }

      return token;
}

async function getFCMToken() {
      let token;

      try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                  token = fcmToken;
                  // console.log('token : ', token);
            } else {
                  console.log('Failed to get FCM token');
            }
      } catch (error) {
            console.log('Error getting FCM token:', error);
      }
      return token;
}

import notifee, {AndroidImportance} from '@notifee/react-native';

export default function NotificationHandler() {
      const onDisplayNotification = async (remoteMessage, isForeground) => {
            const {title, body} = remoteMessage.notification;

            const soundName = isForeground ? 'notification_sound' : 'notification_sound_background';

            const id = isForeground ? 'sound_channel' : 'background_sound_channel';

            const channelId = await notifee.createChannel({
                  id: id,
                  name: 'Important Notifications',
                  importance: AndroidImportance.HIGH,
                  sound: soundName,
            });

            await notifee.displayNotification({
                  title,
                  body,
                  android: {
                        channelId,
                        importance: AndroidImportance.HIGH,
                        sound: soundName,
                  },
            });
      };

      useEffect(() => {
            const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
                  const isInventoryChannel = remoteMessage?.data?.sound_channel == 'inventory';

                  onDisplayNotification(remoteMessage, isInventoryChannel);
            });

            messaging().setBackgroundMessageHandler(async remoteMessage => {
                  const isInventoryChannel = remoteMessage?.data?.sound_channel === 'inventory';
                  onDisplayNotification(remoteMessage, isInventoryChannel);
            });

            const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
                  onDisplayNotification(remoteMessage, false);
            });

            messaging()
                  .getInitialNotification()
                  .then(remoteMessage => {
                        if (remoteMessage) {
                              onDisplayNotification(remoteMessage, false);
                        }
                  });

            return () => {
                  unsubscribeOnMessage();
                  unsubscribeOnNotificationOpened();
            };
      }, []);

      return null;
}

export function useNotificationHandler() {
      const [notification, setNotification] = useState(null);

      useEffect(() => {
            const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
                  // console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
                  // setNotification(remoteMessage);
            });

            const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
                  setNotification(remoteMessage);
            });

            messaging().getInitialNotification();

            return () => {
                  unsubscribeOnMessage();
                  unsubscribeOnNotificationOpened();
            };
      }, []);

      return {notification};
}
