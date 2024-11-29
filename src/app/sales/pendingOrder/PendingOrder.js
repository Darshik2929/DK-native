import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import API from '../../../api/API';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import OrderCard from '../clientNewOrder/component/OrderCard';
import FetchComp from '../../../components/fetchOrder/FetchOrder';

export default function NewOrder() {
      const [incomingOrder, setIncomingOrder] = useState([]);

      const [isLoading, setIsLoading] = useState(true);

      const fetchOrders = async () => {
            setIsLoading(true);

            try {
                  const response = await API.get(`/client/get-client-order/pending/${true}`);
                  setIncomingOrder(response.orders);
            } catch (error) {
                  console.log('error get("/client/get-client : ', JSON.stringify(error));
            } finally {
                  setIsLoading(false);
            }
      };

      useEffect(() => {
            fetchOrders();
      }, []);

      const acceptOrder = async cardData => {
            setIsLoading(true);

            try {
                  await API.patch(`/client/orders/${cardData._id}/accepted/${true}`);

                  console.log('object');

                  fetchOrders();
            } catch (error) {
                  console.log('error patch(/client/order/ : ', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const rejectOrder = async cardData => {
            setIsLoading(true);

            try {
                  await API.delete(`/client/orders/${cardData._id}`);

                  fetchOrders();
            } catch (error) {
                  console.log('error patch(/client/order/ : ', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const cardActionButton = [
            {label: 'Reject', handle: rejectOrder},
            {label: 'Accept', handle: acceptOrder},
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
                  <View style={{marginBottom: 80}}>
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
