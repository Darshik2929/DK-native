import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {PaperProvider, Text, Button, Modal, Portal, TextInput, DefaultTheme} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import BillUploadMode from './components/BillUploadModel';
import {useFocusEffect} from '@react-navigation/native';
import FetchComp from '../../components/fetchOrder/FetchOrder';
import BillingCard from './components/BillingCard';
import API from '../../api/API';
import {useNotificationHandler} from '../../../FCMService';

export default function NewBill(route) {
      const {functions} = route.route.params; // Destructure the passed function

      const {notification} = useNotificationHandler();

      const [rejectReason, setRejectReason] = useState('');

      const handleReject = async () => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`/user/orders/${showRejectionModel._id}/billing`, {
                        status: {rejected: true, active: false},
                        rejection_reason: rejectReason,
                  });

                  if (response.success) {
                        fetchBillingOrder();
                        setShowRejectionModel(false);
                        setRejectReason('');
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            } finally {
                  setIsLoading(false);
            }
      };

      const [showRejectionModel, setShowRejectionModel] = useState(null);

      const handleComplete = async cardData => {
            try {
                  const response = await API.patch(`/user/orders/${cardData._id}/billing/complete-order`);

                  if (response.success) {
                        fetchBillingOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

      const [showBillUploadBillModel, setShowBillUploadBillModel] = useState(null);

      const handleLaterBilty = async cardData => {
            try {
                  const response = await API.patch(`/user/orders/${cardData._id}/billing/attach-later-bilty`);

                  if (response.success) {
                        fetchBillingOrder();
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

      const cardActionButton = [
            {label: 'Reject', handle: setShowRejectionModel},
            {label: 'Attach', handle: setShowBillUploadBillModel},
            {label: 'Attach Bilty Later', handle: handleLaterBilty},
            {label: 'Complete', handle: handleComplete},
      ];

      const [newOrderList, setNewOrderList] = useState([]);

      const fetchBillingOrder = async () => {
            setIsLoading(true);

            try {
                  const response = await API.get('/user/orders/billing/pending');
                  console.log("🚀 ~ fetchBillingOrder ~ response:", response.orders.length)

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
                  fetchBillingOrder();
                  // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [notification]),
      );

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
                        <FetchComp isLoading={isLoading} fetchFunc={fetchBillingOrder} />

                        <ScrollView contentContainerStyle={styles.container}>
                              {newOrderList.length ? (
                                    newOrderList.map((cardData, index) => (
                                          <BillingCard dontShowComponent={true} cardActionButton={cardActionButton} key={index} cardData={cardData} />
                                    ))
                              ) : (
                                    <>
                                          <View>
                                                <Text>No order available</Text>
                                          </View>
                                    </>
                              )}
                        </ScrollView>

                        <Portal>
                              <Modal
                                    visible={!!showRejectionModel}
                                    onDismiss={() => setShowRejectionModel(false)}
                                    contentContainerStyle={styles.modal}>
                                    <Text variant="titleMedium" style={{marginBottom: 16}}>
                                          Reason for Rejection
                                    </Text>

                                    <TextInput
                                          label="Reason"
                                          mode="outlined"
                                          value={rejectReason}
                                          onChangeText={setRejectReason}
                                          multiline
                                          numberOfLines={4}
                                          style={styles.input}
                                    />

                                    <View style={styles.modalActions}>
                                          <Button mode="contained" onPress={handleReject} style={styles.modalButton}>
                                                Submit
                                          </Button>
                                          <Button mode="outlined" onPress={() => setShowRejectionModel(false)} style={styles.modalButton}>
                                                Cancel 1666
                                          </Button>
                                    </View>
                              </Modal>
                        </Portal>

                        <BillUploadMode
                              fetchBillingOrder={fetchBillingOrder}
                              showBillUploadBillModel={showBillUploadBillModel}
                              title={showBillUploadBillModel?.title}
                              hideModal={() => setShowBillUploadBillModel(null)}
                              orderStatus="active"
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
