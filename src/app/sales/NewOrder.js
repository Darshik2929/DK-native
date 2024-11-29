import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import OrderCard from './clientNewOrder/component/OrderCard';
import FetchComp from '../../components/fetchOrder/FetchOrder.js';
import API from '../../api/API';
import {useFocusEffect} from '@react-navigation/native';

export default function NewOrder() {
      const [incomingOrder, setIncomingOrder] = useState([]);

      const [isLoading, setIsLoading] = useState(true);

      const fetchOrders = async () => {
            setIsLoading(true);

            try {
                  const response = await API.get(`/client/get-client-order/accepted/${false}`);
                  setIncomingOrder(response.orders);
            } catch (error) {
                  console.log('error get("/client/get-client : ', JSON.stringify(error));
            } finally {
                  setIsLoading(false);
            }
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchOrders();
            }, []),
      );

      const acceptOrder = async cardData => {
            setIsLoading(true);

            try {
                  await API.patch(`/client/orders/${cardData._id}/accepted/${true}`);

                  fetchOrders();
            } catch (error) {
                  console.log('error patch(/order/ : ', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const pendingOrder = async cardData => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`/client/orders/${cardData._id}/pending/${true}`);
                  console.log('response : ', response);
                  fetchOrders();
            } catch (error) {
                  console.log('error patch(/order/ : ', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const cardActionButton = [
            {label: 'Accept', handle: acceptOrder},
            {label: 'Pending', handle: pendingOrder},
      ];

      const customTheme = {
            ...DefaultTheme,
            colors: {
                  ...DefaultTheme.colors,
                  primary: '#3e4a57',
            },
      };

      return (
            <PaperProvider theme={customTheme}>
                  <View style={{marginBottom: 40}}>
                        <FetchComp isLoading={isLoading} fetchFunc={fetchOrders} />

                        <ScrollView contentContainerStyle={{marginHorizontal: 20}}>
                              {incomingOrder.length ? (
                                    incomingOrder?.map(order => <OrderCard key={order._id} cardData={order} cardActionButton={cardActionButton} />)
                              ) : (
                                    <Text> No Order Available </Text>
                              )}
                        </ScrollView>
                  </View>
            </PaperProvider>
      );
}
