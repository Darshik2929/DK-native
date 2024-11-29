import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Button, Modal, Portal, TextInput, ActivityIndicator} from 'react-native-paper';
import API from '../../api/API';

export default function RejectionModel(props) {
      const {orderDetails, hideModal, department, fetchNewOrder} = props;

      const [isLoading, setIsLoading] = useState(false);

      const [rejectReason, setRejectReason] = useState('');

      const handleReject = async () => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`/user/orders/${orderDetails._id}/${department}`, {
                        status: {rejected: true, active: false},
                        rejection_reason: rejectReason,
                  });

                  if (response.success) {
                        fetchNewOrder();
                        hideModal();
                        setRejectReason('');
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            } finally {
                  setIsLoading(false);
            }
      };

      return (
            <Portal>
                  <Modal visible={!!orderDetails} onDismiss={hideModal} contentContainerStyle={styles.modal}>
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
                              <Button mode="outlined" onPress={hideModal} style={styles.modalButton}>
                                    Cancel
                              </Button>

                              {isLoading ? (
                                    <ActivityIndicator
                                          style={{height: 'auto', justifyContent: 'center', margin: 'auto', width: '50%'}}
                                          animating={true}
                                          color={'#000000'}
                                    />
                              ) : (
                                    <Button mode="contained" onPress={handleReject} style={styles.modalButton}>
                                          Reject
                                    </Button>
                              )}
                        </View>
                  </Modal>
            </Portal>
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
