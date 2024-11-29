import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import clientNewOrder from '../../app/client/clientNewOrder.js';
import clientAcceptedOrder from '../../app/client/clientAcceptedOrder.js';
import Icons from 'react-native-vector-icons/FontAwesome6';
import IconsMaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ClientTabs() {
      return (
            <Tab.Navigator
                  screenOptions={({route}) => ({
                        tabBarShowLabel: true,
                        tabBarStyle: {
                              backgroundColor: '#ffffff',
                              borderTopWidth: 0,
                              height: 60,
                              paddingBottom: 10,
                        },
                        tabBarActiveTintColor: '#3e4a57',
                        tabBarInactiveTintColor: '#bdbbbb',
                        tabBarLabelStyle: {
                              fontSize: 12,
                              fontWeight: 'bold',
                        },
                        tabBarIcon: ({color, size}) => {
                              let iconName;

                              if (route.name === 'Accepted Order') {
                                    iconName = 'cart-plus';
                              } else if (route.name === 'New Order') {
                                    iconName = 'cart-shopping';
                              } else {
                                    return <IconsMaterialIcons name={'inventory'} size={20} style={{marginTop: 10}} color={color} />;
                              }

                              return <Icons name={iconName} size={20} style={{marginTop: 10}} color={color} />;
                        },
                  })}>
                  <Tab.Screen name="New Order" component={clientNewOrder} options={{headerShown: false}} />
                  <Tab.Screen name="Accepted Order" component={clientAcceptedOrder} options={{headerShown: false}} />
            </Tab.Navigator>
      );
}

export default function clientScreen() {
      return (
            <Stack.Navigator>
                  <Stack.Screen name="Client Screen" component={ClientTabs} options={{headerShown: false, title: 'Sales'}} />
            </Stack.Navigator>
      );
}
