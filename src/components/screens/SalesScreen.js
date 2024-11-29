/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CreateOrder from '../../app/sales/CreateOrder.js';
import NewOrder from '../../app/sales/NewOrder.js';
import PendingOrder from '../../app/sales/pendingOrder/PendingOrder.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5.js';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6.js';
import API from '../../api/API.js';
import {useFocusEffect} from '@react-navigation/native';
import {View} from 'react-native';
import Badges from '../badges/Badges.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SalesTabs() {
      const roles = useSelector(state => state.roles.roles);

      const hasAccess = roleKey => {
            return roles.some(role => role.sales === roleKey);
      };

      const [activeOrder, setactiveOrder] = useState(0);
      const [pendingOrder, setPendingOrder] = useState(0);

      const fetchOrders = async () => {
            try {
                  const response = await API.get(`/client/get-client-order/accepted/${false}`);
                  setactiveOrder(response.orders.length);
            } catch (error) {
                  console.log('error get("/client/get-client : ', JSON.stringify(error));
            } finally {
            }
      };

      const fetchOrdersPending = async () => {
            try {
                  const response = await API.get(`/client/get-client-order/pending/${true}`);
                  setPendingOrder(response.orders.length);
            } catch (error) {
                  console.log('error get("/client/get-client : ', JSON.stringify(error));
            } finally {
            }
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchOrders();
                  fetchOrdersPending();
            }, []),
      );

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
                        tabBarIcon: ({color}) => {
                              let icon;
                              if (route.name === 'Create Order') {
                                    icon = <FontAwesome5Icon name="cart-plus" size={20} style={{marginTop: 10}} color={color} />;
                              } else if (route.name === 'New Order') {
                                    icon = <FontAwesome6Icon name="cart-shopping" size={20} style={{marginTop: 10}} color={color} />;
                              } else {
                                    icon = <MaterialIcons name="pending-actions" size={20} style={{marginTop: 10}} color={color} />;
                              }

                              return (
                                    <View style={{position: 'relative'}}>
                                          {icon}
                                          {route.name === 'Pending Order' && <Badges count={pendingOrder} />}
                                          {route.name === 'New Order' && <Badges count={activeOrder} />}
                                    </View>
                              );
                        },
                  })}>
                  {hasAccess('create_order') && <Tab.Screen name="Create Order" component={CreateOrder} options={{headerShown: false}} />}
                  {hasAccess('new_order') && <Tab.Screen name="New Order" component={NewOrder} options={{headerShown: false}} />}
                  {hasAccess('pending_order') && <Tab.Screen name="Pending Order" component={PendingOrder} options={{headerShown: false}} />}
            </Tab.Navigator>
      );
}

export default function SalesScreen() {
      return (
            <Stack.Navigator>
                  <Stack.Screen name="SalesTabs" component={SalesTabs} options={{headerShown: false, title: 'Sales'}} />
            </Stack.Navigator>
      );
}
