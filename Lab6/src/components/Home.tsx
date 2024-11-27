import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface ServiceItem {
  id: number;
  name: string;
  price: number;
}

type HomeProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function Home({navigation}: HomeProps) {
  const [data, setData] = useState<ServiceItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get<ServiceItem[]>(
        'https://kami-backend-5rs0.onrender.com/services',
      );
      console.log('Fetched data:', response.data);
      setData(response.data);
    } catch (err: any) {
      setError('Failed to load data. Please try again later.');
      console.error('Error making GET request:', err);
      if (err.response) {
        console.error('Error response:', err.response);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error during request setup:', err.message);
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
          <Text style={styles.title}>Danh sách dịch vụ</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Service')}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View>
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('ServiceDetail', {item})}>
              <Text style={styles.rowText}>{item.name}</Text>
              <Text>{item.price}</Text>
            </TouchableOpacity>
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
  row: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rowText: {fontWeight: 'bold', fontSize: 16},
  errorText: {color: 'red', margin: 10},
});
