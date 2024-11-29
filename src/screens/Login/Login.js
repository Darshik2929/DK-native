import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../api/API';

const LoginScreen = ({setIsLoggedIn}) => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');

      const handleLogin = async () => {
            try {
                  const response = await API.post('/client/login', {
                        name: username,
                        password,
                  });
                  const {client_id} = response;

                  await AsyncStorage.setItem('client_id', client_id);

                  setIsLoggedIn(true);
            } catch (e) {
                  setError('Login failed. Please check your credentials.');
                  console.log('Login error:', e);
            }
      };

      return (
            <View style={styles.container}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Enter your username" />

                  <Text style={styles.label}>Password</Text>
                  <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />

                  {error ? <Text style={styles.error}>{error}</Text> : null}

                  <Button title="Login" onPress={handleLogin} />
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            flex: 1,
            padding: 16,
            justifyContent: 'center',
      },
      label: {
            fontSize: 16,
            marginBottom: 8,
      },
      input: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 12,
            paddingHorizontal: 8,
      },
      error: {
            color: 'red',
            marginBottom: 16,
      },
});

export default LoginScreen;
