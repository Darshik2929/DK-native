import {View, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import API from '../../api/API';
import FetchComp from '../../components/fetchOrder/FetchOrder';
import OrderCard from './component/Card.js';
import {useFocusEffect} from '@react-navigation/native';

export default function ClientAcceptedOrder() {
      const customTheme = {
            ...DefaultTheme,
            colors: {
                  ...DefaultTheme.colors,
                  primary: '#3e4a57',
            },
      };

      const [orders, setOrders] = useState([]);

      const fetchOrders = async () => {
            try {
                  const response = await API.get('/client/orders/confirmed');

                  setOrders(response.orders);
            } catch (error) {
                  console.error('Error fetching product:', error);
            }
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchOrders();
            }, []),
      );

      return (
            <>
                  <PaperProvider theme={customTheme}>
                        <View style={styles.container}>
                              <FetchComp fetchFunc={fetchOrders} label="Fetch Orders" />

                              <ScrollView contentContainerStyle={styles.scrollContainer}>
                                    {orders.map((el, index) => {
                                          return (
                                                <View key={index} style={{padding: 10}}>
                                                      <OrderCard cardData={el} />
                                                </View>
                                          );
                                    })}
                              </ScrollView>
                        </View>
                  </PaperProvider>
            </>
      );
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
            paddingTop: 4,
            backgroundColor: '#FFFFFF',
            marginTop: 35,
      },
});
