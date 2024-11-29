import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {PaperProvider, Text, DefaultTheme} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import CardComponent from '../../components/machining/Card';
import RejectionModel from '../../components/models/RejectionModel';
import FetchComp from '../../components/fetchOrder/FetchOrder';
import {useNotificationHandler} from '../../../FCMService';
import API from '../../api/API';

export default function MachiningNewOrder(route) {
      const {functions} = route.route.params; // Destructure the passed function

      const {notification} = useNotificationHandler();

      const [isLoading, setIsLoading] = useState(true);

      const [newOrderList, setNewOrderList] = useState([]);

      const [showRejectionModel, setShowRejectionModel] = useState(null);

      const fetchMachiningOrder = async () => {
            setIsLoading(true);
            try {
                  const response = await API.get('/user/orders/machining/pending');
                  setNewOrderList(response.orders);
                  functions();
            } catch (error) {
                  console.log('error ==>', error);
            } finally {
                  setIsLoading(false);
            }
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchMachiningOrder();
                  // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [notification]),
      );

      const handleStart = async (cardData, isAllPartsAvailable) => {
            setIsLoading(true);
            try {
                  const response = await API.patch(`/user/orders/${cardData._id}/machining`, {
                        status: isAllPartsAvailable ? {completed: true} : {accepted: true, active: true},
                  });
                  if (response.success) {
                        fetchMachiningOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

      const handleAccept = async cardData => {
            setIsLoading(true);
            try {
                  const response = await API.patch(`/user/orders/${cardData._id}/machining`, {status: {accepted: true}});
                  if (response.success) {
                        fetchMachiningOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

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
            <PaperProvider theme={customTheme}>
                  <FetchComp isLoading={isLoading} fetchFunc={fetchMachiningOrder} />

                  <ScrollView contentContainerStyle={styles.container}>
                        {newOrderList.length ? (
                              newOrderList.map((cardData, index) => (
                                    <CardComponent cardActionButton={cardActionButton} key={index} cardData={cardData} />
                              ))
                        ) : (
                              <View>
                                    <Text>No order available</Text>
                              </View>
                        )}
                  </ScrollView>

                  <RejectionModel
                        orderDetails={showRejectionModel}
                        fetchNewOrder={fetchMachiningOrder}
                        hideModal={() => setShowRejectionModel(null)}
                        department="machining"
                  />
            </PaperProvider>
      );
}

const styles = StyleSheet.create({
      container: {
            flexGrow: 1,
            padding: 16,
            backgroundColor: 'white',
      },
});
