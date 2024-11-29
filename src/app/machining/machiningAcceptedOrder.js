import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {DefaultTheme, PaperProvider, Text} from 'react-native-paper';
import {TabView, TabBar} from 'react-native-tab-view';
import CardWithComponentStatus from '../../components/machining/CardWithComponentStatus.js';
import FetchComp from '../../components/fetchOrder/FetchOrder';
import API from '../../api/API.js';
import {useNotificationHandler} from '../../../FCMService.js';
import {useFocusEffect} from '@react-navigation/native';

const MachiningAcceptedOrder = route => {
      const {functions} = route.route.params; // Destructure the passed function

      const [index, setIndex] = useState(0);

      const [activeOrderListLength, setActiveOrderListLength] = useState(0);
      const [pendingOrderListLength, setPendingOrderListLength] = useState(0);

      const [routes, setRoutes] = useState([
            {key: 'active', title: `Active Orders ${activeOrderListLength}`},
            {key: 'pending', title: `Pending Orders ${pendingOrderListLength}`},
      ]);

      const [isLoading, setIsLoading] = useState(true);

      const [activeOrderList, setActiveOrderList] = useState([]);

      const [pendingOrderList, setPendingOrderList] = useState([]);

      const fetchMachiningOrder = async () => {
            setIsLoading(true);
            try {
                  const response = await API.get('/user/orders/machining/accepted');

                  setActiveOrderList(response.orders.filter(el => !!el.machining.active));

                  const active = response.orders.filter(el => !!el.machining.active).length;

                  setActiveOrderListLength(active);

                  const pending = response.orders.filter(el => !el.machining.active).length;

                  setPendingOrderListLength(pending);

                  setRoutes([
                        {key: 'active', title: `Active Orders ${active ? active : ''}`},
                        {key: 'pending', title: `Pending Orders ${pending ? pending : ''}`},
                  ]);

                  setPendingOrderList(response.orders.filter(el => !el.machining.active));

                  setIsLoading(false);

                  functions();
            } catch (error) {
                  console.log('error API.get(/user/orders/machining ==>', JSON.stringify(error));
            }
      };

      const {notification} = useNotificationHandler();

      useFocusEffect(
            React.useCallback(() => {
                  fetchMachiningOrder();
                  // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [notification]),
      );

      const patchOrderStatus = async (status, componentId, productId, orderId) => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`user/orders/${orderId}/products/${productId}/components/${componentId}`, {
                        status,
                        department: 'machining',
                  });

                  if (response.success) {
                        fetchMachiningOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

      const pressStart = async orderId => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`/user/orders/${orderId}/machining`, {status: {active: true}});

                  if (response.success) {
                        fetchMachiningOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

      const handleSendPackaging = async id => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`/user/orders/${id}/machining`, {status: {completed: true}});

                  if (response.success) {
                        fetchMachiningOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
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
                                                      key={index}
                                                      cardData={cardData}
                                                      showSwitch={showActionButton}
                                                      pressStart={handleSendPackaging}
                                                      actionButtonTitle="Send to Packaging"
                                                      showActionButton={showActionButton}
                                                      patchOrderStatus={patchOrderStatus}
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
                                                      patchOrderStatus={patchOrderStatus}
                                                      key={index}
                                                      cardData={cardData}
                                                      showActionButton={showActionButton}
                                                      pressStart={pressStart}
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
            },
      };

      return (
            <PaperProvider theme={customTheme}>
                  <FetchComp isLoading={isLoading} fetchFunc={fetchMachiningOrder} />

                  <TabView
                        navigationState={{index, routes}}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        renderTabBar={renderTabBar}
                        initialLayout={{width: '100%'}}
                  />
            </PaperProvider>
      );
};

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

export default MachiningAcceptedOrder;
