import React, {useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Animated} from 'react-native';
import {Provider as PaperProvider, Button, ActivityIndicator, DefaultTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import API from '../../../../api/API';
import {useNotificationHandler} from '../../../../../FCMService';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from '../../../../constants/Colors';

export default function PackagingComponent(props) {
      const {department, fetchBoxCartoon} = props;

      const [productList, setProductList] = useState([]);

      const [loaderState, setLoaderState] = useState({product: true, submit: false});

      const showActionButton = true;

      const formatProducts = product => {
            setValue(
                  `${product._id}.${department}`,
                  product[department].map(el => ({label: el.name, value: el._id, quantity: el.quantity, minimum_quantity: el.minimum_quantity})),
            );
      };

      const fetchProductList = async () => {
            setLoaderState(prevState => ({...prevState, product: true}));

            try {
                  const response = await API.get('/product');

                  setProductList(
                        response.products.map(el => {
                              formatProducts(el);
                              return {label: el.name, value: el._id};
                        }),
                  );

                  setLoaderState(prevState => ({...prevState, product: false}));
            } catch (error) {
                  console.error('Error API.get(/product?page:', error);
            }
      };

      const {notification} = useNotificationHandler();

      useFocusEffect(
            React.useCallback(() => {
                  fetchProductList();
                  // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [notification]),
      );

      const {control, handleSubmit, setValue, watch, reset} = useForm({defaultValues: {component: []}});

      const [openProduct, setOpenProduct] = useState([]);

      const handleProductShow = id => {
            openProduct.includes(id)
                  ? setOpenProduct(prevState => prevState.filter(el => el !== id))
                  : setOpenProduct(prevState => [...prevState, id]);
      };

      const updateInventory = async body => {
            setLoaderState(prevState => ({...prevState, submit: true}));
            try {
                  const response = await API.patch(`/inventory/update/${department}`, body);

                  if (response.success) {
                        setLoaderState(prevState => ({...prevState, submit: false}));
                        fetchProductList();
                        reset();
                        fetchBoxCartoon();
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

      const formatInventory = data => {
            const body = {
                  updates: [],
            };

            Object.values(data).forEach(entry => {
                  if (entry[department]) {
                        entry[department].forEach(component => {
                              const componentId = component.value;
                              const quantityChange = entry[componentId]?.quantity;

                              if (quantityChange !== undefined && quantityChange !== '') {
                                    body.updates.push({
                                          _id: componentId,
                                          quantity_change: parseInt(quantityChange, 10),
                                    });
                              }
                        });
                  }
            });

            updateInventory(body);
      };

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
                        {loaderState.product ? (
                              <ActivityIndicator
                                    style={{height: 'auto', justifyContent: 'center', margin: 'auto', display: 'flex'}}
                                    animating={true}
                                    color={'#000000'}
                              />
                        ) : (
                              <View style={styles.container}>
                                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                                          {productList?.map((product, index) => (
                                                <ProductItem
                                                      key={index}
                                                      product={product}
                                                      isOpen={openProduct.includes(product.value)}
                                                      onToggle={() => handleProductShow(product.value)}
                                                      watch={watch}
                                                      control={control}
                                                      department={department}
                                                      showActionButton={showActionButton}
                                                />
                                          ))}
                                          <View style={{height: 100}} />
                                    </ScrollView>
                              </View>
                        )}

                        <View style={styles.fixedBottomContainer}>
                              <Button mode="contained" onPress={handleSubmit(formatInventory)} style={styles.submitButton}>
                                    Add Inventory
                              </Button>
                        </View>
                  </PaperProvider>
            </>
      );
}

const ProductItem = ({product, isOpen, onToggle, watch, control, showActionButton, department}) => {
      const animation = useRef(new Animated.Value(0)).current;

      React.useEffect(() => {
            Animated.timing(animation, {
                  toValue: isOpen ? 1 : 0,
                  duration: 300,
                  useNativeDriver: false,
            }).start();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOpen]);

      const opacity = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
      });

      const [heights, setHeights] = useState([]);

      const updateHeight = (index, height) => {
            setHeights(prevHeights => {
                  const newHeights = [...prevHeights];
                  newHeights[index] = height;
                  return newHeights;
            });
      };

      const totalHeight = heights.reduce((acc, height) => acc + height, 0);

      const height = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, totalHeight + 10],
      });

      const hasLowQuantity = watch(`${product.value}.${department}`).some(el => el.quantity < el.minimum_quantity);

      return (
            <View style={{...styles.productContainer, borderColor: hasLowQuantity ? 'red' : '#ccc'}}>
                  <TouchableOpacity style={styles.productHeaderContainer} activeOpacity={0.8} onPress={onToggle}>
                        <Text style={styles.productHeader}>{product.label}</Text>
                        <AntDesign name={!isOpen ? 'down' : 'up'} size={14} color="gray" />
                  </TouchableOpacity>

                  <Animated.View style={{height, opacity, overflow: 'hidden', marginTop: 5}}>
                        {watch(`${product.value}.${department}`).map((el, index) => {
                              const isQuantityLow = el.quantity < el.minimum_quantity;

                              return (
                                    <View
                                          key={index}
                                          onLayout={event => {
                                                const {height} = event.nativeEvent.layout;
                                                updateHeight(index, height); // Store the height of each component
                                          }}
                                          style={{
                                                ...styles.productDetailContainer,
                                                borderBottomWidth: index + 1 === watch(`${product.value}.${department}`).length ? 0 : 0.3,
                                                borderBottomColor: isQuantityLow ? 'red' : '#ccc',
                                                paddingBottom: index + 1 === watch(`${product.value}.${department}`).length ? 0 : 12,
                                          }}>
                                          <Text style={styles.productDetail}>
                                                {el.label} ({el.quantity})
                                          </Text>

                                          {showActionButton && (
                                                <Controller
                                                      control={control}
                                                      render={({field: {onChange, value}}) => (
                                                            <TextInput
                                                                  placeholder="Quantity"
                                                                  value={value}
                                                                  keyboardType="number-pad"
                                                                  onChangeText={onChange}
                                                                  style={[
                                                                        styles.quantityInput,
                                                                        {borderColor: isQuantityLow ? 'red' : '#ccc', borderWidth: 1}, // Conditionally change the TextInput border color to red
                                                                  ]}
                                                                  autoCapitalize="none"
                                                                  spellCheck={false}
                                                            />
                                                      )}
                                                      name={`${product.value}.${el.value}.quantity`}
                                                      defaultValue=""
                                                />
                                          )}
                                    </View>
                              );
                        })}
                  </Animated.View>
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            padding: 8,
      },
      scrollContainer: {
            paddingHorizontal: 16,
      },
      input: {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            height: 35,
      },
      productContainer: {
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 12,
            borderWidth: 0.8,
            borderRadius: 8,
            marginTop: 16,
      },
      dateTimeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 16,
      },
      dateButton: {
            flex: 1,
            height: 50,
            borderColor: 'gray',
            borderWidth: 0.5,
            borderRadius: 8,
            justifyContent: 'center',
            // marginVertical: 16,
      },
      checkboxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
      },
      fixedBottomContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 16,
            borderTopWidth: 0.3,
      },
      submitButton: {
            paddingVertical: 10,
            justifyContent: 'center',
      },
      productHeader: {
            fontSize: 18,
            fontWeight: 'bold',
            color: 'gray',
      },
      productHeaderContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 0,
            borderColor: Colors.label,
            backgroundColor: 'white',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
      },
      productDetailContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            gap: 4,
            paddingVertical: 12,
      },
      productDetail: {
            fontSize: 16,
      },
      quantityInput: {
            backgroundColor: 'white',
            borderRadius: 8,
            height: 40,
            paddingHorizontal: 10,
            borderWidth: 0.9,
            width: 90,
            marginRight: 2,
      },
});
