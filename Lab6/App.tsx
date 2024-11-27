/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {Text, SafeAreaView, StyleSheet, View, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Customer from './src/components/Customer';
import AddCustomer from './src/components/AddCustomer';
import Logout from './src/components/Logout';
import Transaction from './src/components/Transaction';
import AddTransaction from './src/components/AddTransaction';
import Edit from './src/components/Edit';
import EditTransaction from './src/components/EditTransaction';
import Home from './src/components/Home';
import Login from './src/components/Login';
import Service from './src/components/Service';
import ServiceDetail from './src/components/ServiceDetail';
import TransactionDetail from './src/components/TransactionDetail';

// Types
type ServiceItem = {
  id: string;
  name: string;
};

type TransactionItem = {
  _id: string;
  name: string;
};

// API URL
const API_URL = 'https://kami-backend-5rs0.onrender.com/services';

// Delete Service Function
const deleteService = async (item: ServiceItem, navigation: any) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'No authentication token found.');
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the service: ${item.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await axios.delete(`${API_URL}/${item.id}`, {
                headers: {Authorization: `Bearer ${token}`},
              });
              console.log('Delete Response:', response.data);
              Alert.alert('Success', 'Service deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete service');
            }
          },
        },
      ],
    );
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'An unexpected error occurred');
  }
};

// Delete Transaction Function
const deleteTransaction = async (item: TransactionItem, navigation: any) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'No authentication token found.');
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the transaction: ${item.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await axios.delete(
                `https://kami-backend-5rs0.onrender.com/transactions/${item._id}`,
                {headers: {Authorization: `Bearer ${token}`}},
              );
              console.log('Delete Response:', response.data);
              Alert.alert('Success', 'Transaction deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ],
    );
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'An unexpected error occurred');
  }
};

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// Stack Navigators for different sections
const CustomerStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Customer" component={Customer} />
    <Stack.Screen name="AddCustomer" component={AddCustomer} />
  </Stack.Navigator>
);

const LogoutStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Logout" component={Logout} />
  </Stack.Navigator>
);

const TransactionMenu = ({
  navigation,
  item,
}: {
  navigation: any;
  item: TransactionItem;
}) => (
  <Menu>
    <MenuTrigger>
      <SimpleLineIcons name="options-vertical" size={24} color="black" />
    </MenuTrigger>
    <MenuOptions>
      <MenuOption onSelect={() => deleteTransaction(item, navigation)}>
        <Text style={styles.menuOptionText}>Delete Transaction</Text>
      </MenuOption>
    </MenuOptions>
  </Menu>
);

const TransStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Transaction" component={Transaction} />
    <Stack.Screen name="AddTransaction" component={AddTransaction} />
    <Stack.Screen name="EditTransaction" component={EditTransaction} />
    <Stack.Screen
      name="TransactionDetail"
      component={TransactionDetail}
      options={({navigation, route}: any) => {
        const item = route.params?.item;
        return {
          headerRight: () =>
            item ? (
              <TransactionMenu navigation={navigation} item={item} />
            ) : null,
          title: 'TransactionDetail',
        };
      }}
    />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{
        headerRight: () => (
          <View>
            <Ionicons
              name="person-circle"
              size={30}
              color="black"
              style={{marginRight: 10}}
            />
          </View>
        ),
        title: 'HUYỀN TRINH',
      }}
    />
    <Stack.Screen name="Service" component={Service} />
    <Stack.Screen name="Edit" component={Edit} />
    <Stack.Screen
      name="ServiceDetail"
      component={ServiceDetail}
      options={({navigation, route}: any) => ({
        headerRight: () => (
          <Menu>
            <MenuTrigger>
              <SimpleLineIcons
                name="options-vertical"
                size={24}
                color="black"
              />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption
                onSelect={() =>
                  route.params?.item &&
                  deleteService(
                    {id: route.params.item._id, name: route.params.item.name},
                    navigation,
                  )
                }>
                <Text style={styles.menuOptionText}>Delete Service</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        ),
        title: 'ServiceDetail',
      })}
    />
  </Stack.Navigator>
);

// Bottom Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator barStyle={{backgroundColor: 'white'}}>
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({color}: any) => (
          <Ionicons name="home" color={color} size={25} />
        ),
      }}
    />
    <Tab.Screen
      name="Transaction"
      component={TransStack}
      options={{
        tabBarLabel: 'Transaction',
        tabBarIcon: ({color}: any) => (
          <Ionicons name="wallet" color={color} size={25} />
        ),
      }}
    />
    <Tab.Screen
      name="Customer"
      component={CustomerStack}
      options={{
        tabBarLabel: 'Customer',
        tabBarIcon: ({color}: any) => (
          <Ionicons name="people" color={color} size={25} />
        ),
      }}
    />
    <Tab.Screen
      name="Setting"
      component={LogoutStack}
      options={{
        tabBarLabel: 'Setting',
        tabBarIcon: ({color}: any) => (
          <Ionicons name="settings" color={color} size={25} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Main App
export default function App() {
  return (
    <MenuProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MyTab"
              component={TabNavigator}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </MenuProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  menuOptionText: {
    padding: 10,
    fontSize: 18,
  },
});
