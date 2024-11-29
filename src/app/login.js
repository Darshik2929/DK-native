/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button, Text, ActivityIndicator} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
// import {usePushNotifications} from '../usePushNotifications.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import IconsMaterialIcons from '@expo/vector-icons/MaterialIcons';
import API from '../api/API';
import {requestUserPermission} from '../../FCMService';

export default function LoginScreen(props) {
      const navigation = useNavigation();

      //   const {expoPushToken} = usePushNotifications();

      const [authToken, setAuthToken] = useState(null);

      const {
            control,
            handleSubmit,
            formState: {errors},
            setError,
      } = useForm();

      const hasAuthToken = async () => {
            let authenticationData = await AsyncStorage.getItem('auth_token');

            if (authenticationData) {
                  navigation.navigate('sales/index');
            }

            setAuthToken(authenticationData);

            return authenticationData;
      };

      const [isLoading, setIsLoading] = useState(false);

      const [firebaseNotificationToken, setFirebaseNotificationToken] = useState(null);

      const generateToken = async () => {
            const token = await requestUserPermission();
            setFirebaseNotificationToken(token);
      };

      useEffect(() => {
            hasAuthToken();

            generateToken();
      }, []);

      const handleLogin = async data => {
            setIsLoading(true);

            const encryptedPassword = data.password;
            const encryptedUserName = data.userName;

            console.log('firebaseNotificationToken : ', firebaseNotificationToken);

            const body = {user_name: encryptedUserName, password: encryptedPassword, notification_token: firebaseNotificationToken};

            try {
                  const response = await API.post('/auth/login', body);

                  if (response?.token) {
                        await AsyncStorage.setItem('auth_token', response.token);

                        setAuthToken(response.token);

                        props?.setAuthToken(response.token);

                        props.setIsClient(response.roles[0].role === 'client');

                        if (response.roles[0].role === 'client') {
                              AsyncStorage.setItem('role', 'client');
                        }
                  }
            } catch (error) {
                  console.log('const error =  post(/auth', error);

                  setError('userName', {message: 'Please enter valid user name'});
                  setError('password', {message: 'Please enter valid password'});
            } finally {
                  setIsLoading(false);
            }
      };

      const onSubmit = data => {
            handleLogin(data);
      };

      return (
            <>
                  <View style={styles.container}>
                        <Text style={styles.title}>Welcome !</Text>

                        {authToken && (
                              <Button
                                    onPress={() => {
                                          AsyncStorage.removeItem('auth_token');
                                          setAuthToken(null);
                                    }}>
                                    remove auth token
                              </Button>
                        )}

                        <Controller
                              control={control}
                              name="userName"
                              render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                          label="Username"
                                          mode="outlined"
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                          error={!!errors.username}
                                          style={styles.input}
                                    />
                              )}
                              rules={{required: 'Please add user name'}}
                        />
                        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

                        <Controller
                              control={control}
                              name="password"
                              render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                          label="Password"
                                          mode="outlined"
                                          secureTextEntry
                                          onBlur={onBlur}
                                          onChangeText={onChange}
                                          value={value}
                                          error={!!errors.password}
                                          style={styles.input}
                                    />
                              )}
                              rules={{required: 'Please add password'}}
                        />
                        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                        <Button
                              mode="contained"
                              style={styles.button}
                              icon={() =>
                                    isLoading ? (
                                          <ActivityIndicator animating={true} color="#6750a4" />
                                    ) : (
                                          <></>
                                          // <IconsMaterialIcons name="login" size={24} color="#FFFFFF" />
                                    )
                              }
                              onPress={handleSubmit(onSubmit)}
                              disabled={isLoading}>
                              Login
                        </Button>
                  </View>
            </>
      );
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#f5f5f5',
      },
      title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#6200ea',
            textAlign: 'center',
            marginBottom: 30,
      },
      input: {
            marginBottom: 10,
      },
      button: {
            marginTop: 20,
      },
      error: {
            color: 'red',
            marginBottom: 10,
      },
});
