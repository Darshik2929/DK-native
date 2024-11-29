/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Animated} from 'react-native';
import {Provider as PaperProvider, Button, DefaultTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FetchComp from '../../components/fetchOrder/FetchOrder';
import {useNotificationHandler} from '../../../FCMService';
import API from '../../api/API';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function Inventory(route) {
      const {functions} = route.route.params; // Destructure the passed function

      const [productList, setProductList] = useState([]);
      const [loaderState, setLoaderState] = useState({
            product: true,
            submit: false,
      });
      const [openProduct, setOpenProduct] = useState([]);
      const {notification} = useNotificationHandler();
      const {
            control,
            handleSubmit,
            setValue,
            watch,
            formState: {isSubmitting},
      } = useForm({
            defaultValues: {component: []},
      });

      const formatProducts = product => {
            setValue(
                  `${product._id}.components`,
                  product?.components?.map(el => {
                        return {
                              label: el?.id?.name,
                              value: el?.id?._id,
                              quantity: el?.id?.quantity,
                              minQuantity: el?.id?.minimum_quantity,
                        };
                  }),
            );
      };

      const fetchProductList = async () => {
            setLoaderState(prevState => ({...prevState, product: true}));

            try {
                  const response = await API.get('/product');

                  const productList = response.products.map(el => {
                        formatProducts(el);
                        return {label: el.name, value: el._id};
                  });

                  setProductList(productList);

                  setLoaderState(prevState => ({...prevState, product: false}));
                  functions();
            } catch (error) {
                  console.error('Error get(/product?page:', error);
            }
      };

      const handleProductShow = id => {
            if (openProduct.includes(id)) {
                  setOpenProduct(prevState => prevState.filter(el => el !== id));
            } else {
                  setOpenProduct(prevState => [...prevState, id]);
            }
      };

      const updateInventory = async body => {
            setLoaderState(prevState => ({
                  ...prevState,
                  submit: true,
            }));

            try {
                  const response = await API.patch('/inventory/update/machining', body);

                  if (response.success) {
                        setLoaderState(prevState => ({
                              ...prevState,
                              submit: false,
                        }));
                        fetchProductList();
                  }
            } catch (error) {
                  console.log('const error patch(/inventory/update = ', JSON.stringify(error));
            }
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchProductList();
                  // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [notification]),
      );

      const formatInventory = data => {
            const body = {
                  updates: [],
            };

            Object.values(data).forEach(entry => {
                  if (entry.components) {
                        entry.components.forEach(component => {
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
                        <FetchComp isLoading={loaderState.product} fetchFunc={fetchProductList} label="Fetch Inventory" />

                        <View style={styles.container}>
                              <ScrollView contentContainerStyle={styles.scrollContainer}>
                                    {productList?.map((product, index) => {
                                          return (
                                                <ProductItem
                                                      key={index}
                                                      product={product}
                                                      isOpen={openProduct.includes(product.value)}
                                                      onToggle={() => handleProductShow(product.value)}
                                                      watch={watch}
                                                      control={control}
                                                      showActionButton={true}
                                                      isSubmitting={isSubmitting}
                                                      setValue={setValue}
                                                />
                                          );
                                    })}

                                    <View style={{height: 100}} />
                              </ScrollView>
                        </View>

                        <View style={styles.fixedBottomContainer}>
                              <Button mode="contained" onPress={handleSubmit(formatInventory)} style={styles.submitButton}>
                                    Add Inventory
                              </Button>
                        </View>
                  </PaperProvider>
            </>
      );
}

const ProductItem = ({product, isOpen, onToggle, watch, control, showActionButton, isSubmitting, setValue}) => {
      const animation = useRef(new Animated.Value(0)).current;

      React.useEffect(() => {
            Animated.timing(animation, {
                  toValue: isOpen ? 1 : 0,
                  duration: 300,
                  useNativeDriver: false,
            }).start();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOpen]);

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

            // outputRange: [0, watch(`${product.value}.components`)?.length * 89],
      });

      const opacity = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
      });

      useEffect(() => {
            watch(`${product.value}.components`).forEach(el => {
                  setValue(`${product.value}.${el.value}.quantity`, null);
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isSubmitting]);

      const hasLowQuantity = watch(`${product.value}.components`).some(el => el.quantity < el.minQuantity);

      return (
            <View style={{...styles.productContainer, borderColor: hasLowQuantity ? 'red' : '#ccc'}}>
                  <TouchableOpacity style={styles.productHeaderContainer} activeOpacity={0.8} onPress={onToggle}>
                        <Text style={styles.productHeader}>{product.label}</Text>
                        <AntDesign name={!isOpen ? 'down' : 'up'} size={14} color="gray" />
                  </TouchableOpacity>

                  <Animated.View style={{height, opacity, overflow: 'hidden', marginTop: 5}}>
                        {watch(`${product.value}.components`).map((el, index) => {
                              const isQuantityLow = el.quantity < el.minQuantity;

                              return (
                                    <View
                                          onLayout={event => {
                                                const {height} = event.nativeEvent.layout;
                                                updateHeight(index, height); // Store the height of each component
                                          }}
                                          key={index}
                                          style={{
                                                ...styles.productDetailContainer,
                                                borderBottomWidth: index + 1 === watch(`${product.value}.components`)?.length ? 0 : 0.3,
                                                borderBottomColor: isQuantityLow ? 'red' : '#ccc',
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
      productContainer: {
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 12,
            borderWidth: 0.8,
            borderRadius: 8,
            marginTop: 16,
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
      productHeader: {
            fontSize: 18,
            fontWeight: 'bold',
            color: 'gray',
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
            borderColor: '#ccc',
            width: 90,
            marginRight: 2,
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
});
