/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import machiningNewOrder from '../../app/machining/machiningNewOrder.js';
import machiningAcceptedOrder from '../../app/machining/machiningAcceptedOrder.js';
import inventory from '../../app/machining/inventory.js';
import Icons from 'react-native-vector-icons/FontAwesome6';
import IconsMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import API from '../../api/API.js';
import {useFocusEffect} from '@react-navigation/native';
import {View} from 'react-native';
import Badge from '../badges/Badges';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MachiningTabs() {
      const [numbers, setNumbers] = useState(0);

      const fetchProductList = async () => {
            try {
                  const response = await API.get('/product');

                  const xxx = countFailingProducts(response.products);

                  setNumbers(xxx);
            } catch (error) {
                  console.error('Error get(/product?page:', error);
            }
      };

      const roles = useSelector(state => state.roles.roles);

      const hasAccess = roleKey => {
            return roles.some(role => role.machining === roleKey);
      };

      const [newOrderList, setNewOrderList] = useState(0);
      const [pending, setPending] = useState(0);

      const fetchMachiningOrder = async () => {
            try {
                  const response = await API.get('/user/orders/machining/pending');
                  setNewOrderList(response.orders.length);
            } catch (error) {
                  console.log('error ==>', error);
            } finally {
            }
      };

      const fetchMachiningOrderAcc = async () => {
            try {
                  const response = await API.get('/user/orders/machining/accepted');

                  setPending(response.orders.length);
            } catch (error) {
                  console.log('error API.get(/user/orders/machining ==>', JSON.stringify(error));
            }
      };

      function countFailingProducts(products) {
            let failingProductsCount = 0;

            for (let product of products) {
                  const hasFailingComponent = product.components.some(component => {
                        return component.id.quantity < component.id.minimum_quantity;
                  });

                  if (hasFailingComponent) {
                        failingProductsCount++;
                  }
            }

            return failingProductsCount;
      }

      const fetchAllFunction = () => {
            fetchMachiningOrder();
            fetchMachiningOrderAcc();
            fetchProductList();
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchAllFunction();
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
                              if (route.name === 'Accepted Order') {
                                    iconName = <Icons name={'cart-plus'} size={20} style={{marginTop: 10}} color={color} />;
                              } else if (route.name === 'New Order') {
                                    iconName = <Icons name={'cart-shopping'} size={20} style={{marginTop: 10}} color={color} />;
                              } else {
                                    iconName = <IconsMaterialIcons name="inventory" size={20} style={{marginTop: 10}} color={color} />;
                              }

                              return (
                                    <View style={{position: 'relative'}}>
                                          {iconName}
                                          {route.name === 'New Order' && <Badge count={newOrderList} />}
                                          {route.name === 'Accepted Order' && <Badge count={pending} />}
                                          {route.name === 'Inventory' && <Badge count={numbers} />}
                                    </View>
                              );
                        },
                  })}>
                  {hasAccess('new_order') && (
                        <Tab.Screen
                              name="New Order"
                              initialParams={{
                                    functions: {fetchAllFunction},
                              }}
                              component={machiningNewOrder}
                              options={{headerShown: false}}
                        />
                  )}
                  {hasAccess('accepted_order') && (
                        <Tab.Screen
                              name="Accepted Order"
                              initialParams={{
                                    functions: {fetchAllFunction},
                              }}
                              component={machiningAcceptedOrder}
                              options={{headerShown: false}}
                        />
                  )}
                  {hasAccess('inventory') && (
                        <Tab.Screen
                              initialParams={{
                                    functions: {fetchAllFunction},
                              }}
                              name="Inventory"
                              component={inventory}
                              options={{headerShown: false}}
                        />
                  )}
            </Tab.Navigator>
      );
}

export default function MachiningScreen() {
      return (
            <Stack.Navigator>
                  <Stack.Screen name="MachiningTabs" component={MachiningTabs} options={{headerShown: false, title: 'Machining'}} />
            </Stack.Navigator>
      );
}
