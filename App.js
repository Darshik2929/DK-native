import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SalesScreen from './src/components/screens/SalesScreen';
import MachiningScreen from './src/components/screens/MachiningScreen';
import PackagingScreen from './src/components/screens/PackagingScreen';
import BillingScreen from './src/components/screens/BillingScreen';
import ClientScreen from './src/components/screens/ClientScreen';
import LoginScreen from './src/app/login.js';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './src/redux/store.js';
import {setRoles} from './src/redux/slices/rolesSlice';
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen/AnimatedSplashScreen.js';
import API from './src/api/API.js';
import CustomDrawerContent from './src/components/CustomDrawerContent/CustomDrawerContent';
import NotificationHandler from './FCMService.js';

const Drawer = createDrawerNavigator();

const AppContent = () => {
      const [authToken, setAuthToken] = useState(null);
      const [isLoading, setIsLoading] = useState(true);
      const dispatch = useDispatch();
      const [isClient, setIsClient] = useState(false);

      const [isRoleLoading, setIsRoleLoading] = useState(false);

      const roles = useSelector(state => state.roles.roles);

      // AsyncStorage.clear();

      const checkAuthToken = async () => {
            setIsClient(!!(await AsyncStorage.getItem('role')));

            const token = await AsyncStorage.getItem('auth_token');
            setAuthToken(token);

            if (token) {
                  setIsRoleLoading(true);
                  try {
                        const response = await API.get('/user/user-role');
                        dispatch(setRoles(response.role.map(el => el.role)));
                  } catch (error) {
                        console.log('Error fetching roles:', error);
                  } finally {
                        setIsRoleLoading(false);
                  }
            }
            setIsLoading(false);
      };

      useEffect(() => {
            checkAuthToken();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isClient, authToken]);

      if (isLoading || isRoleLoading) {
            return (
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="#6200ea" />
                  </View>
            );
      }

      const linking = {
            prefixes: ['myapp://'],
            config: {
                  screens: {
                        login: 'login/index',
                        sales: 'sales/index',
                        machining: 'machining/index',
                        packaging: 'packaging/index',
                        billing: 'billing/index',
                  },
            },
      };

      const renderScreens = () => {
            const hasRole = roleKey => {
                  const accessRoles = roles.some(role => Object.keys(role)[0] === roleKey);

                  return accessRoles;
            };

            return (
                  <Drawer.Navigator
                        drawerContent={props => <CustomDrawerContent setAuthToken={setAuthToken} setIsClient={setIsClient} {...props} />}
                        screenOptions={{
                              drawerStyle: {
                                    backgroundColor: '#333',
                              },
                              drawerLabelStyle: {
                                    color: '#fff',
                              },
                              headerTitleStyle: {
                                    fontFamily: 'Poppins_500Medium',
                              },
                              drawerActiveTintColor: '#85888b',
                        }}>
                        {hasRole('sales') && (
                              <Drawer.Screen
                                    name="sales/index"
                                    component={SalesScreen}
                                    options={{
                                          title: 'Sales',
                                    }}
                              />
                        )}

                        {hasRole('machining') && (
                              <Drawer.Screen
                                    name="machining/index"
                                    component={MachiningScreen}
                                    options={{
                                          title: 'Machining',
                                    }}
                              />
                        )}
                        {hasRole('packaging') && (
                              <Drawer.Screen
                                    name="packaging/index"
                                    component={PackagingScreen}
                                    options={{
                                          title: 'Packaging',
                                    }}
                              />
                        )}
                        {hasRole('billing') && (
                              <Drawer.Screen
                                    name="billing/index"
                                    component={BillingScreen}
                                    options={{
                                          title: 'Billing',
                                    }}
                              />
                        )}
                        {!roles || roles.length === 0 ? (
                              <Drawer.Screen
                                    name="unauthorized"
                                    component={() => (
                                          <View>
                                                <Text>Unauthorized Access</Text>
                                          </View>
                                    )}
                                    options={{
                                          title: 'Unauthorized',
                                    }}
                              />
                        ) : null}
                  </Drawer.Navigator>
            );
      };

      return (
            <NavigationContainer linking={linking} independent={true}>
                  <GestureHandlerRootView style={{flex: 1}}>
                        {authToken ? (
                              isClient ? (
                                    <ClientScreen />
                              ) : (
                                    !!roles.length && renderScreens()
                              )
                        ) : (
                              <LoginScreen setIsClient={setIsClient} setAuthToken={setAuthToken} />
                        )}
                        <NotificationHandler />
                  </GestureHandlerRootView>
            </NavigationContainer>
      );
};

export default function RootLayout() {
      const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);

      const handleAnimationEnd = () => {
            setSplashAnimationComplete(true);
      };

      if (!splashAnimationComplete) {
            return <AnimatedSplashScreen onAnimationEnd={handleAnimationEnd} />;
      }

      return (
            <Provider store={store}>
                  <AppContent />
            </Provider>
      );
}

// import React, {useEffect} from 'react';
// import {Platform, Alert} from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import firebase from '@react-native-firebase/app';
// import notifee, {AndroidImportance} from '@notifee/react-native';
// import {Button} from 'react-native-paper';

// const App = () => {
//       useEffect(() => {
//             // Request permission for notifications on iOS
//             const requestUserPermission = async () => {
//                   const authStatus = await messaging().requestPermission();
//                   const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//                   if (enabled) {
//                         console.log('Notification permission granted.');
//                         getToken();
//                   } else {
//                         console.log('Notification permission denied.');
//                   }
//             };

//             // Generate the FCM token
//             const getToken = async () => {
//                   const fcmToken = await messaging().getToken();
//                   if (fcmToken) {
//                         console.log('FCM Token:', fcmToken);
//                         // You can send this token to your server to send notifications.
//                   } else {
//                         console.log('No token received');
//                   }
//             };

//             // Create notification channel for Android
//             const createNotificationChannel = async () => {
//                   if (Platform.OS === 'android') {
//                         await notifee.createChannel({
//                               id: 'channelId',
//                               name: 'Default Channel',
//                               importance: AndroidImportance.HIGH,
//                         });
//                   }
//             };

//             // Display notifications when the app is in the foreground
//             const displayNotification = async notification => {
//                   if (Platform.OS === 'android') {
//                         await notifee.displayNotification({
//                               title: notification.notification.title,
//                               body: notification.notification.body,
//                               android: {
//                                     channelId: 'channelId',
//                                     smallIcon: 'ic_stat_notification', // Make sure you add this icon in Android Studio
//                                     color: '#000000', // Customize color as per your preference
//                                     importance: AndroidImportance.HIGH,
//                               },
//                         });
//                   } else if (Platform.OS === 'ios') {
//                         // Display iOS notification
//                         notifee.displayNotification({
//                               title: notification.notification.title,
//                               body: notification.notification.body,
//                               ios: {
//                                     badgeCount: notification.notification.ios.badge,
//                               },
//                         });
//                   }
//             };

//             // Handle foreground notifications
//             const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
//                   console.log('FCM Message received:', remoteMessage);
//                   displayNotification(remoteMessage);
//             });

//             // Check for any background notification that opened the app
//             messaging()
//                   .getInitialNotification()
//                   .then(remoteMessage => {
//                         if (remoteMessage) {
//                               console.log('Notification opened from quit state:', remoteMessage);
//                         }
//                   });

//             requestUserPermission();
//             createNotificationChannel();

//             // Cleanup subscriptions on component unmount
//             return () => {
//                   unsubscribeOnMessage();
//             };
//       }, []);

//       const onDisplayNotification = async () => {
//             const channelId = await notifee.createChannel({
//                   id: 'important',
//                   name: 'Important Notifications',
//                   importance: AndroidImportance.HIGH,
//             });

//             await notifee.displayNotification({
//                   title: 'Your account requires attention',
//                   body: 'You are overdue payment on one or more of your accounts!',
//                   android: {
//                         channelId,
//                         importance: AndroidImportance.HIGH,
//                   },
//             });
//       };

//       return (
//             <Button
//                   title="Trigger Push Notification"
//                   size="large"
//                   onPress={() => onDisplayNotification('default', 'Default Channel', 'Spotback Android', 'Local push notification')}>
//                   dl
//             </Button>
//       );
// };

// export default App;
