import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {PaperProvider, Text, DefaultTheme} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import CardComponent from './components/Card.js';
import RejectionModel from '../../components/models/RejectionModel';
import FetchComp from '../../components/fetchOrder/FetchOrder';
import {useNotificationHandler} from '../../../FCMService.js';
import API from '../../api/API.js';
import {useFocusEffect} from '@react-navigation/native';

export default function PackagingNewOrder(route) {
      const {functions} = route.route.params; // Destructure the passed function

      const {notification} = useNotificationHandler();

      const [showRejectionModel, setShowRejectionModel] = useState(null);

      const handleStart = async cardData => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`/user/orders/${cardData._id}/packaging`, {status: {accepted: true, active: true}});

                  if (response.success) {
                        fetchPackagingOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

      const handleAccept = async cardData => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`/user/orders/${cardData._id}/packaging`, {status: {accepted: true, active: false}});

                  if (response.success) {
                        fetchPackagingOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

      const [newOrderList, setNewOrderList] = useState([]);

      const fetchPackagingOrder = async () => {
            setIsLoading(true);

            try {
                  const response = await API.get('/user/orders/packaging/pending');

                  setNewOrderList(response.orders);

                  functions();
            } catch (error) {
                  console.log('error ==>', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const [isLoading, setIsLoading] = useState(true);

      useFocusEffect(
            React.useCallback(() => {
                  fetchPackagingOrder();
                  // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [notification]),
      );

      const cardActionButton = [
            {label: 'Reject', handle: setShowRejectionModel},
            {label: 'Pending', handle: handleAccept},
            {label: 'Active', handle: handleStart},
      ];

      const customTheme = {
            ...DefaultTheme,
            colors: {
                  ...DefaultTheme.colors,
                  primary: '#3e4a57',
            },
      };

      return (
            <>
                  <PaperProvider theme={customTheme}>
                        <FetchComp isLoading={isLoading} fetchFunc={fetchPackagingOrder} />

                        <ScrollView contentContainerStyle={styles.container}>
                              {newOrderList.length ? (
                                    newOrderList.map((cardData, index) => (
                                          <CardComponent department="packaging" cardActionButton={cardActionButton} key={index} cardData={cardData} />
                                    ))
                              ) : (
                                    <>
                                          <View>
                                                <Text>No order available</Text>
                                          </View>
                                    </>
                              )}
                        </ScrollView>
                        <RejectionModel
                              orderDetails={showRejectionModel}
                              fetchNewOrder={fetchPackagingOrder}
                              hideModal={() => setShowRejectionModel(null)}
                              department="packaging"
                        />
                  </PaperProvider>
            </>
      );
}

const styles = StyleSheet.create({
      button: {
            borderRadius: 8,
      },
      card: {
            marginBottom: 16,
            padding: 12,
      },
      cardContent: {
            backgroundColor: '#ebedf0',
            borderRadius: 8,
            elevation: 2,
            marginVertical: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            shadowColor: '#000',
            shadowOffset: {
                  width: 0,
                  height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
      },
      container: {
            backgroundColor: '#FFFFFF',
            flexGrow: 1,
            padding: 16,
      },
      input: {
            marginBottom: 16,
      },
      modal: {
            backgroundColor: 'white',
            borderRadius: 8,
            elevation: 5,
            margin: 20,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: {
                  width: 0,
                  height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
      },
      modalActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
      },
      modalButton: {
            flex: 1,
            marginHorizontal: 8,
      },
      text: {
            marginVertical: 2,
      },
});
