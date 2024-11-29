/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import attachBill from '../../app/billing/attachBill.js';
import newBill from '../../app/billing/newBill.js';
import IconsIonicons from 'react-native-vector-icons/Ionicons.js';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import API from '../../api/API.js';
import {View} from 'react-native';
import Badge from '../badges/Badges.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BillingTabs() {
      const roles = useSelector(state => state.roles.roles);

      const hasAccess = roleKey => {
            return roles.some(role => role.billing === roleKey);
      };

      const [newOrderList, setNewOrderList] = useState(0);

      const [accepted_order, setAccepted_order] = useState(0);

      const fetchBillingOrder = async () => {
            try {
                  const response = await API.get('/user/orders/billing/pending');

                  setNewOrderList(response.orders.length);
            } catch (error) {
                  console.log('error ==>', error);
            } finally {
            }
      };

      const fetchBillingOrderAcc = async () => {
            try {
                  const response = await API.get('/user/orders/billing/active');

                  setAccepted_order(response.data.length);
            } catch (error) {
                  console.log('const error =  get(/user/orders/billing', JSON.stringify(error));
            } finally {
            }
      };

      const fetchAllFunction = () => {
            fetchBillingOrder();
            fetchBillingOrderAcc();
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchBillingOrder();
                  fetchBillingOrderAcc();
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
                              let iconName;
                              if (route.name === 'New Bill') {
                                    iconName = <IconsIonicons name="document" size={20} style={{marginTop: 10}} color={color} />;
                              } else {
                                    iconName = <IconsIonicons name="document-attach" size={20} style={{marginTop: 10}} color={color} />;
                              }
                              return (
                                    <View style={{position: 'relative'}}>
                                          {iconName}
                                          {route.name === 'New Bill' && <Badge count={newOrderList} />}
                                          {route.name === 'Attach Bill' && <Badge count={accepted_order} />}
                                    </View>
                              );
                        },
                  })}>
                  {hasAccess('new_bill') && (
                        <Tab.Screen
                              initialParams={{
                                    functions: {fetchAllFunction},
                              }}
                              name="New Bill"
                              component={newBill}
                              options={{headerShown: false}}
                        />
                  )}
                  {hasAccess('attach_bill') && (
                        <Tab.Screen
                              initialParams={{
                                    functions: {fetchAllFunction},
                              }}
                              name="Attach Bill"
                              component={attachBill}
                              options={{headerShown: false}}
                        />
                  )}
            </Tab.Navigator>
      );
}

export default function BillingScreen() {
      return (
            <Stack.Navigator>
                  <Stack.Screen name="BillingTabs" component={BillingTabs} options={{headerShown: false, title: 'Billing'}} />
            </Stack.Navigator>
      );
}
