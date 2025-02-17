import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://kami-backend-5rs0.onrender.com/auth';

import { NavigationProp } from '@react-navigation/native';

interface LoginProps {
  navigation: NavigationProp<any>;
}

export default function Login({ navigation }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await axios.post(API_URL, { phone, password });

      if (response.data.token) {
        const token = response.data.token;
        console.log('Login successful, Token:', token);

        // Store the token for future use
        await AsyncStorage.setItem('authToken', token);

        // Navigate to MyTab
        navigation.reset({
          index: 0, // Set index to 0 so that 'MyTab' is the first screen
          routes: [{ name: 'MyTab' }], // Route to 'MyTab' (your HomeStack)
        });
      } else {
        Alert.alert('Login failed', 'No token returned.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login failed',
        'Please check your credentials and try again.'
      );
    }
  };

  return (
    <View>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Phone"
        style={styles.inputField}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.inputField}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  button: {
    padding: 20,
    backgroundColor: 'pink',
    borderRadius: 20,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'pink',
    margin: 20,
  },
});
