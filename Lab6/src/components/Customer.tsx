/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect} from 'react';
import axios from 'axios';

export default function Customer({navigation}: any) {
  interface Customer {
    id: number;
    name: string;
    phone: string;
    totalSpent: number;
  }

  const [data, setData] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://kami-backend-5rs0.onrender.com/customers',
      );
      console.log('Fetched data:', response.data);
      setData(response.data);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error making GET request:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('Error response:', err.response);
        } else if (err.request) {
          console.error('No response received:', err.request);
        } else {
          console.error('Error during request setup:', err.message);
        }
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIYOVIPA4kDgklhl57Ba8YMTNJTbz9s23L0w&s',
          }}
        />

        <View style={styles.firstRow}>
          <Text style={styles.title}>Danh sách </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AddCustomer')}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={item =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        renderItem={({item}) => (
          <View style={styles.border}>
            <Text>Customer name: {item.name}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>Total money: {item.totalSpent}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#ecf0f1', padding: 8},
  logo: {width: '100%'},
  button: {
    backgroundColor: 'pink',
    borderRadius: 50,
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontWeight: 'bold', textAlign: 'center'},
  title: {fontWeight: 'bold', marginLeft: 10, marginTop: 10, fontSize: 18},
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    padding: 10,
  },
  border: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
});
