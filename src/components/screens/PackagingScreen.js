/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import packagingNewOrder from '../../app/packaging/packagingNewOrder.js';
import packagingAcceptedOrder from '../../app/packaging/packagingAcceptedOrder.js';
import inventory from '../../app/packaging/inventory.js';
import {useSelector} from 'react-redux';
import Icons from 'react-native-vector-icons/FontAwesome6';
import IconsMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {View} from 'react-native';
import Badge from '../badges/Badges.js';
import {useFocusEffect} from '@react-navigation/native';
import API from '../../api/API.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PackagingTabs() {
      const roles = useSelector(state => state.roles.roles);

      const hasAccess = roleKey => {
            return roles.some(role => role.packaging === roleKey);
      };

      const [newOrderList, setNewOrderListBuget] = useState(0);
      console.log("🚀 ~ PackagingTabs ~ newOrderList:", newOrderList)

      const [acceptedOrdxer, setAcceptedOrdxer] = useState(0);

      const fetchPackagingOrder = async () => {
            try {
                  const response = await API.get('/user/orders/packaging/pending');

                  setNewOrderListBuget(response.orders.length);
            } catch (error) {
                  console.log('error ==>', error);
            } finally {
            }
      };

      const fetchPackagingOrderacc = async () => {
            try {
                  const response = await API.get('/user/orders/packaging/accepted');

                  setAcceptedOrdxer(response.orders.length);
            } catch (error) {
                  console.log('error ==>', error);
            } finally {
            }
      };

      const fetchProductList = async () => {
            try {
                  const response = await API.get('/product');

                  const numberOfProducts = response.products.filter(el =>
                        el.components.some(component => component.id.minimum_quantity < component.id.quantity),
                  ).length;

                  setNumbers(numberOfProducts);
            } catch (error) {
                  console.error('Error get(/product?page:', error);
            }
      };

      const fetchAllFunction = () => {
            fetchPackagingOrder();
            fetchPackagingOrderacc();
            fetchProductList();
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchPackagingOrder();
                  fetchPackagingOrderacc();
                  fetchProductList();
            }, []),
      );

      const [numbers, setNumbers] = useState(0);

      const [routes, setRoutes] = useState([
            {key: 'box', title: 0},
            {key: 'cartoon', title: 0},
            {key: 'sticker', title: 0},
            {key: 'plastic_bag', title: 0},
      ]);

      const fetchBoxCartoon = async () => {
            try {
                  const response = await API.get('/product');

                  const cartoonNo =
                        response?.products?.filter(el => el?.cartoon?.some(filEl => filEl.minimum_quantity > filEl.quantity))?.length || 0;
                  const boxNo = response?.products?.filter(el => el?.box?.some(filEl => filEl.minimum_quantity > filEl.quantity))?.length || 0;
                  setRoutes(prevRoutes =>
                        prevRoutes.map(route =>
                              route.key === 'box' ? {...route, title: boxNo} : route.key === 'cartoon' ? {...route, title: cartoonNo} : route,
                        ),
                  );
            } catch (error) {
                  console.error('Error fetchBoxCartoon:', error);
            }
      };

      const fetchStickerBag = async () => {
            try {
                  const stResponse = await API.get('/inventory/sticker/components');
                  const plasticBagRes = await API.get('/inventory/plastic_bag/components');

                  const stNo = stResponse.components.filter(el => el.minimum_quantity > el.quantity).length;
                  const bagNo = plasticBagRes.components.filter(el => el.minimum_quantity > el.quantity).length;

                  setRoutes(prevRoutes =>
                        prevRoutes.map(route =>
                              route.key === 'sticker' ? {...route, title: stNo} : route.key === 'plastic_bag' ? {...route, title: bagNo} : route,
                        ),
                  );
            } catch (error) {
                  console.error('Error fetchBoxCartoon:', error);
            }
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchStickerBag();
                  fetchBoxCartoon();
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
                                          {route.name === 'Accepted Order' && <Badge count={acceptedOrdxer} />}
                                          {route.name === 'Inventory' && <Badge count={routes.reduce((sum, route) => sum + route.title, 0)} />}
                                    </View>
                              );
                        },
                  })}>
                  {hasAccess('new_order') && (
                        <Tab.Screen
                              initialParams={{
                                    functions: {fetchAllFunction},
                              setNewOrderListBuget: setNewOrderListBuget,

                              }}
                              name="New Order"
                              component={packagingNewOrder}
                              options={{headerShown: false}}
                        />
                  )}
                  {hasAccess('accepted_order') && (
                        <Tab.Screen
                              name="Accepted Order"
                              initialParams={{
                                    functions: {fetchAllFunction},
                              }}
                              component={packagingAcceptedOrder}
                              options={{headerShown: false}}
                        />
                  )}
                  {hasAccess('inventory') && (
                        <Tab.Screen
                              initialParams={{
                                    functions: {fetchBoxCartoon, fetchStickerBag},
                              }}
                              name="Inventory"
                              component={inventory}
                              options={{headerShown: false}}
                        />
                  )}
            </Tab.Navigator>
      );
}

export default function PackagingScreen() {
      return (
            <Stack.Navigator>
                  <Stack.Screen name="PackagingTabs" component={PackagingTabs} options={{headerShown: false, title: 'Packaging'}} />
            </Stack.Navigator>
      );
}
