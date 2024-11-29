/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {DefaultTheme, PaperProvider, Text} from 'react-native-paper';
import {TabView, TabBar} from 'react-native-tab-view';
import CardWithComponentStatus from './components/CardWithComponentStatus.js';
import FetchComp from '../../components/fetchOrder/FetchOrder';
import {useNotificationHandler} from '../../../FCMService.js';
import API from '../../api/API.js';
import {useFocusEffect} from '@react-navigation/native';

export default function PackagingAcceptedOrder(route) {
      const {functions} = route.route.params; // Destructure the passed function

      const [index, setIndex] = useState(0);
      // const [routes] = useState([
      //       {key: 'active', title: 'Active Orders'},
      //       {key: 'pending', title: 'Pending Orders'},
      // ]);

      const [activeOrderListLength, setActiveOrderListLength] = useState(0);
      const [pendingOrderListLength, setPendingOrderListLength] = useState(0);

      const [routes, setRoutes] = useState([
            {key: 'active', title: `Active Orders ${activeOrderListLength}`},
            {key: 'pending', title: `Pending Orders ${pendingOrderListLength}`},
      ]);

      const {notification} = useNotificationHandler();

      const [isLoading, setIsLoading] = useState(true);

      const [activeOrderList, setActiveOrderList] = useState([]);

      const [pendingOrderList, setPendingOrderList] = useState([]);

      const fetchPackagingOrder = async () => {
            setIsLoading(true);

            try {
                  const response = await API.get('/user/orders/packaging/accepted');

                  const active = response.orders.filter(el => !!el.packaging.active).length;
                  const pending = response.orders.filter(el => !el.packaging.active).length;

                  setActiveOrderListLength(active);
                  setPendingOrderListLength(pending);

                  setRoutes([
                        {key: 'active', title: `Active Orders ${active ? active : ''}`},
                        {key: 'pending', title: `Pending Orders ${pending ? pending : ''}`},
                  ]);

                  setActiveOrderList(response.orders.filter(el => !!el.packaging.active));

                  setPendingOrderList(response.orders.filter(el => !el.packaging.active));

                  functions();
            } catch (error) {
                  console.log('error fetchPackagingOrder ==>', error);
            } finally {
                  setIsLoading(false);
            }
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchPackagingOrder();

                  // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [notification]),
      );

      const handlePressComplete = async orderId => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`/user/orders/${orderId}/packaging`, {status: {completed: true}});

                  if (response.success) {
                        await API.patch(`/user/orders/${orderId}/billing`, {status: {accepted: true}});
                        fetchPackagingOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error handlePressComplete = ', JSON.stringify(error));
            }
      };

      const handlePressStartPackaging = async orderId => {
            try {
                  const response = await API.patch(`/user/orders/${orderId}/packaging`, {status: {active: true}});

                  if (response.success) {
                        fetchPackagingOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const handlePressStartPackaging error = ', error);
            }
      };

      const showActionButton = true;

      const renderScene = ({route}) => {
            switch (route.key) {
                  case 'active':
                        return (
                              <ScrollView contentContainerStyle={styles.container}>
                                    {activeOrderList.length ? (
                                          activeOrderList.map((cardData, index) => (
                                                <CardWithComponentStatus
                                                      showActionButton={showActionButton}
                                                      pressStart={() => handlePressComplete(cardData._id)}
                                                      actionButtonTitle="Complete"
                                                      key={index}
                                                      cardData={cardData}
                                                />
                                          ))
                                    ) : (
                                          <View>
                                                <Text>No order available</Text>
                                          </View>
                                    )}
                              </ScrollView>
                        );

                  case 'pending':
                        return (
                              <ScrollView contentContainerStyle={styles.container}>
                                    {pendingOrderList.length ? (
                                          pendingOrderList.map((cardData, index) => (
                                                <CardWithComponentStatus
                                                      showActionButton={showActionButton}
                                                      pressStart={() => handlePressStartPackaging(cardData._id)}
                                                      actionButtonTitle="Start"
                                                      key={index}
                                                      cardData={cardData}
                                                />
                                          ))
                                    ) : (
                                          <View>
                                                <Text>No order available</Text>
                                          </View>
                                    )}
                              </ScrollView>
                        );
                  default:
                        return null;
            }
      };

      const renderTabBar = props => (
            <TabBar
                  {...props}
                  style={styles.tabBar}
                  indicatorStyle={styles.tabIndicator}
                  labelStyle={styles.tabLabel}
                  renderLabel={({route, focused, color}) => {
                        const parts = route.title.split(' ');
                        const textPart = parts[0] + ' ' + parts[1];
                        const digitPart = parts[2];

                        return (
                              <View style={{...styles.tabLabel, display: 'flex', flexDirection: 'row'}} numberOfLines={1} ellipsizeMode="tail">
                                    <Text>{textPart}</Text>
                                    {digitPart != 0 && (
                                          <View
                                                style={{
                                                      borderRadius: 10,
                                                      width: 15,
                                                      height: 15,
                                                      backgroundColor: 'red',
                                                      color: 'white',
                                                      // borderRadius: 999,
                                                      marginLeft: 2,
                                                      paddingLeft: 2,
                                                }}>
                                                <Text style={{color: 'white', paddingLeft: 2}}>{digitPart}</Text>
                                          </View>
                                    )}
                              </View>
                        );
                  }}
            />
      );

      const customTheme = {
            ...DefaultTheme,
            colors: {
                  ...DefaultTheme.colors,
                  primary: '#3e4a57',
                  // accent: "#3f4e5a", // Slightly lighter shade (Secondary)
                  // background: "#f5f5f5", // Light Grey (Background)
                  // surface: "#ffffff", // White (Surface)
                  // text: "#000000", // Black (Text)
                  // disabled: "#bcbcbc", // Light Grey (Disabled)
                  // placeholder: "#a0a0a0", // Grey (Placeholder)
                  // backdrop: "#2d343b",
            },
      };

      return (
            <PaperProvider theme={customTheme}>
                  <FetchComp isLoading={isLoading} fetchFunc={fetchPackagingOrder} />

                  <TabView
                        navigationState={{index, routes}}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        renderTabBar={renderTabBar}
                        initialLayout={{width: Dimensions.get('window').width}}
                  />
            </PaperProvider>
      );
}

const styles = StyleSheet.create({
      container: {
            flexGrow: 1,
            backgroundColor: '#FFFFFF',
            padding: 16,
      },
      tabBar: {
            backgroundColor: '#f5f5f5',
      },
      tabIndicator: {
            backgroundColor: '#3e4a57',
      },
      tabLabel: {
            color: '#3e4a57',
            fontWeight: 600,
      },
});
