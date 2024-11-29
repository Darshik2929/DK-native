import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import {ActivityIndicator, Button, Modal, Portal, Text} from 'react-native-paper';
import {TabView, TabBar} from 'react-native-tab-view';
import {Image} from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';

export default function BillUploadModal(props) {
      const {showBillUploadBillModel, hideModal, title, fetchBillingOrder, orderStatus} = props;

      const [index, setIndex] = useState(0);

      const isBill = showBillUploadBillModel?.uploads?.some(card => card.type === 'bill');

      const initialRoutes = isBill
            ? [{key: 'bilty', title: 'Attach Bilty'}]
            : [
                    {key: 'bill', title: 'Attach Bill'},
                    {key: 'bilty', title: 'Attach Bilty'},
              ];

      const [routes, setRoutes] = useState(initialRoutes);

      useEffect(() => {
            isBill
                  ? setRoutes([{key: 'bilty', title: 'Attach Bilty'}])
                  : setRoutes([
                          {key: 'bill', title: 'Attach Bill'},
                          {key: 'bilty', title: 'Attach Bilty'},
                    ]);
      }, [isBill]);

      const [images, setImages] = useState({bill: [], bilty: []});

      // const result = await ImagePicker.launchImageLibraryAsync({
      //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //       base64: true,
      //       quality: 1,
      // });
      //     ,
      //     (response) => {
      //       console.log(response);
      //       this.setState({
      //         resourcePath: response
      //       });
      //     },
      //   )

      // const pickImage = async type => {
      //       const result = await ImagePicker.launchImageLibrary({
      //             mediaType: 'photo',
      //       });

      //       if (!result.canceled) {
      //             setImages(prevState => ({...prevState, [type]: [...images[type], ...result.assets]}));
      //       }
      // };

      // const result = await ImagePicker.launchImageLibrary({
      //       mediaType: 'photo',
      //       includeBase64: false,
      //       maxHeight: 200,
      //       maxWidth: 200,
      // });
      // base64: true,
      // quality: 1,

      const pickImage = async type => {
            try {
                  const result = await ImagePicker.launchImageLibrary({
                        mediaType: 'photo',
                  });

                  // Check if the action was canceled
                  if (result.didCancel) {
                        console.log('User canceled image picker');
                        return;
                  }

                  if (result.assets) {
                        setImages(prevState => ({
                              ...prevState,
                              [type]: [...images[type], ...result.assets],
                        }));
                  }
            } catch (error) {
                  console.log('Error while picking image: ', error);
            }
      };

      const takePicture = async type => {
            try {
                  const result = await ImagePicker.launchCamera({
                        mediaType: 'photo',
                  });

                  // Check if the action was canceled
                  if (result.didCancel) {
                        console.log('User canceled camera');
                        return;
                  }

                  if (result.assets && result.assets.length > 0) {
                        setImages(prevState => ({
                              ...prevState,
                              [type]: [...images[type], result.assets[0]],
                        }));
                  }
            } catch (error) {
                  console.log('Error while taking picture: ', error);
            }
      };

      const removeImage = uri => {
            setImages(prevState => ({...prevState, [routes[index].key]: images[routes[index].key].filter(image => image.uri !== uri)}));
      };

      const renderImage = ({item}) => (
            <View style={styles.imageContainer}>
                  <Image source={{uri: item.uri}} style={styles.image} />
                  <TouchableOpacity onPress={() => removeImage(item.uri)} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>X</Text>
                  </TouchableOpacity>
            </View>
      );

      const renderScene = ({route}) => {
            switch (route.key) {
                  case 'bill':
                        return (
                              <View style={styles.scene}>
                                    <FlatList data={images.bill} renderItem={renderImage} keyExtractor={item => item.uri} style={styles.imageList} />
                                    <View style={styles.buttonGroup}>
                                          <Button mode="contained" onPress={() => pickImage('bill')} style={styles.button}>
                                                Pick Images
                                          </Button>
                                          <Button mode="contained" onPress={() => takePicture('bill')} style={styles.button}>
                                                Take Picture
                                          </Button>
                                    </View>
                              </View>
                        );

                  case 'bilty':
                        return (
                              <View style={styles.scene}>
                                    <FlatList data={images.bilty} renderItem={renderImage} keyExtractor={item => item.uri} style={styles.imageList} />

                                    <View style={styles.buttonGroup}>
                                          <Button mode="contained" onPress={() => pickImage('bilty')} style={styles.button}>
                                                Pick Images
                                          </Button>
                                          <Button mode="contained" onPress={() => takePicture('bilty')} style={styles.button}>
                                                Take Picture
                                          </Button>
                                    </View>
                              </View>
                        );

                  default:
                        return null;
            }
      };

      const [isLoading, setIsLoading] = useState(false);

      const renderTabBar = props => <TabBar {...props} style={styles.tabBar} indicatorStyle={styles.tabIndicator} labelStyle={styles.tabLabel} />;

      const uploadBill = async () => {
            if (!images.bill.length) {
                  return;
            }

            const formData = new FormData();

            formData.append('type', 'bill');

            for (const image of images.bill) {
                  const uriParts = image.uri.split('.');
                  const fileType = uriParts[uriParts.length - 1];

                  formData.append('images', {
                        uri: image.uri,
                        name: `photo.${fileType}`,
                        type: `image/${fileType}`,
                  });
            }

            try {
                  let authenticationData = await AsyncStorage.getItem('auth_token');

                  await axios.put(`https://node-dk-product-xi.vercel.app/api/user/orders/${showBillUploadBillModel._id}/uploads`, formData, {
                        headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${authenticationData}`},
                  });

                  fetchBillingOrder();

                  hideModal();
            } catch (error) {
                  console.log('const error = ', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const uploadBilty = async () => {
            const formData = new FormData();

            if (!images.bilty.length) {
                  return;
            }

            formData.append('type', 'bilty');

            for (const image of images.bilty) {
                  const uriParts = image.uri.split('.');
                  const fileType = uriParts[uriParts.length - 1];

                  formData.append('images', {
                        uri: image.uri,
                        name: `photo.${fileType}`,
                        type: `image/${fileType}`,
                  });
            }

            try {
                  let authenticationData = await AsyncStorage.getItem('auth_token');

                  await axios.put(`https://node-dk-product-xi.vercel.app/api/user/orders/${showBillUploadBillModel._id}/uploads`, formData, {
                        headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${authenticationData}`},
                  });

                  fetchBillingOrder();

                  hideModal();
            } catch (error) {
                  console.log('const error = ', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const uploadCompletedBilty = async () => {
            const formData = new FormData();

            if (!images.bilty.length) {
                  return;
            }

            formData.append('type', 'bilty');

            for (const image of images.bilty) {
                  const uriParts = image.uri.split('.');
                  const fileType = uriParts[uriParts.length - 1];

                  formData.append('images', {
                        uri: image.uri,
                        name: `photo.${fileType}`,
                        type: `image/${fileType}`,
                  });
            }

            try {
                  let authenticationData = await AsyncStorage.getItem('auth_token');

                  await axios.put(
                        `https://node-dk-product-xi.vercel.app/api/user/orders/${showBillUploadBillModel._id}/completed-order-uploads`,
                        formData,
                        {headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${authenticationData}`}},
                  );

                  fetchBillingOrder();

                  hideModal();
            } catch (error) {
                  console.log('const error = ', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const handleSave = async () => {
            setIsLoading(true);
            if (orderStatus == 'completed') {
                  uploadCompletedBilty();
                  return;
            }

            uploadBill();
            uploadBilty();
      };

      const handleCancel = () => {
            hideModal();
      };

      return (
            <Portal>
                  <Modal visible={!!showBillUploadBillModel} onDismiss={handleCancel} contentContainerStyle={styles.modal}>
                        <Text variant="titleMedium" style={{marginBottom: 16}}>
                              Upload Documents for {title}
                        </Text>
                        <TabView
                              navigationState={{index, routes}}
                              renderScene={renderScene}
                              onIndexChange={setIndex}
                              renderTabBar={renderTabBar}
                              initialLayout={{width: Dimensions.get('window').width}}
                              style={{flex: 1, paddingTop: 8, marginTop: 16}}
                        />
                        <View style={styles.footer}>
                              <Button mode="outlined" onPress={handleCancel} style={styles.footerButton}>
                                    Cancel
                              </Button>

                              {isLoading ? (
                                    <ActivityIndicator
                                          style={{height: 'auto', justifyContent: 'center', margin: 'auto', width: '50%'}}
                                          animating={true}
                                          color={'#000000'}
                                    />
                              ) : (
                                    <Button mode="contained" onPress={handleSave} style={styles.footerButton}>
                                          Save
                                    </Button>
                              )}
                        </View>
                  </Modal>
            </Portal>
      );
}

const styles = StyleSheet.create({
      image: {
            width: 200,
            height: 200,
            marginRight: 10,
            borderWidth: 0.5,
            borderColor: 'black',
      },
      imageContainer: {
            position: 'relative',
            marginVertical: 20,
      },
      removeButton: {
            position: 'absolute',
            top: -10,
            right: 0,
            backgroundColor: 'red',
            borderRadius: 50,
            paddingLeft: 6,
            textAlign: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
      },
      removeButtonText: {
            color: 'white',
            fontWeight: 'bold',
      },
      modal: {
            flex: 1,
            backgroundColor: 'white',
            margin: 20,
            padding: 20,
            borderRadius: 8,
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
      scene: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
      },
      buttonGroup: {
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            paddingTop: 16,
      },
      footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
      },
      footerButton: {
            flex: 1,
            marginHorizontal: 8,
            width: 1 / 2,
      },
});
