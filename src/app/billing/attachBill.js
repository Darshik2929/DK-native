/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {PaperProvider, Text, Modal, Portal, TextInput, DefaultTheme} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import BillUploadMode from './components/BillUploadModel.js';
import {useFocusEffect} from '@react-navigation/native';
import FetchComp from '../../components/fetchOrder/FetchOrder';
import BillingCard from './components/BillingCard.js';
import API from '../../api/API.js';

export default function AttachBill(route) {
      const {functions} = route.route.params; // Destructure the passed function

      const [visible, setVisible] = useState(false);
      const [rejectReason, setRejectReason] = useState('');

      const showModal = () => setVisible(true);
      const hideModal = () => setVisible(false);

      const [showBillUploadBillModel, setShowBillUploadBillModel] = useState(null);

      const cardActionButton = [{label: 'Attach', handle: setShowBillUploadBillModel}];

      const [newOrderList, setNewOrderList] = useState([]);

      const [isLoading, setIsLoading] = useState(true);

      const fetchBillingOrder = async () => {
            setIsLoading(true);

            try {
                  const response = await API.get('/user/orders/billing/active');

                  setNewOrderList(response.data);
                  functions();
            } catch (error) {
                  console.log('const error =  get(/user/orders/billing', JSON.stringify(error));
            } finally {
                  setIsLoading(false);
            }
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchBillingOrder();
            }, []),
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
                        {/* <Button onPress={fetchBillingOrder}>Fetch New Order</Button> */}

                        <FetchComp isLoading={isLoading} fetchFunc={fetchBillingOrder} />

                        <ScrollView contentContainerStyle={styles.container}>
                              {newOrderList.length ? (
                                    newOrderList.map((cardData, index) => (
                                          <BillingCard cardActionButton={cardActionButton} handleReject={showModal} key={index} cardData={cardData} />
                                    ))
                              ) : (
                                    <View>
                                          <Text>No order available</Text>
                                    </View>
                              )}
                        </ScrollView>

                        <Portal>
                              <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
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
                              </Modal>
                        </Portal>

                        <BillUploadMode
                              fetchBillingOrder={fetchBillingOrder}
                              showBillUploadBillModel={showBillUploadBillModel}
                              title={showBillUploadBillModel?.title}
                              hideModal={() => setShowBillUploadBillModel(null)}
                              orderStatus="completed"
                        />
                  </PaperProvider>
            </>
      );
}

const styles = StyleSheet.create({
      button: {
            borderRadius: 8,
            marginVertical: 8,
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
      image: {
            width: 100,
            height: 100,
            marginRight: 10,
      },
      imageList: {
            marginVertical: 10,
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
      radioGroup: {
            marginVertical: 16,
      },
      radioButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 4,
      },
});
