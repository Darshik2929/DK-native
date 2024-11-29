import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text, Alert} from 'react-native';
import {Provider as PaperProvider, Button, ActivityIndicator, RadioButton} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropdownComponent from '../../components/dropdown/Dropdown.js';
import MultiSelectComponent from '../../components/dropdown/MultiSelectionDropdown.js';
import API from '../../api/API';
import ErrorMessage from '../../components/Error/ErrorMessage.js';
import OrderItem from './component/OrderItem.js';
import {DefaultTheme} from 'react-native-paper';
import {format} from 'date-fns';
import {Colors} from '../../constants/Colors.js';

export default function Index() {
      const {
            control,
            handleSubmit,
            setValue,
            watch,
            formState: {errors, isSubmitting},
            setError,
            clearErrors,
      } = useForm({defaultValues: {product: [], dueTime: new Date()}});

      const [date, setDate] = React.useState(new Date());
      const [time, setTime] = React.useState(new Date());
      const [showDatePicker, setShowDatePicker] = React.useState(false);
      const [showTimePicker, setShowTimePicker] = React.useState(false);

      const [isLoadingPlaceOrder, setIsLoadingPlaceOrder] = useState(false);

      const reset = () => {
            setValue('product', []);

            setValue('partyName', '');

            setSelectedProductMultiSelection([]);

            setDate(new Date());

            setTime(new Date());

            // watchedProducts.map((el) => {
            //     setValue(el.value, "");
            //     console.log(`el.value ==>`, el.value);
            // });
      };

      const formatDateTime = data => {
            const localDate = data.dueDate ? new Date(data.dueDate.getTime() - data.dueDate.getTimezoneOffset() * 60000) : new Date();

            const hours = data.dueTime ? new Date(data.dueTime.getTime() - data.dueTime.getTimezoneOffset() * 60000).getHours() : 0;
            const minutes = data.dueTime ? new Date(data.dueTime.getTime() - data.dueTime.getTimezoneOffset() * 60000).getMinutes() : 0;
            const seconds = data.dueTime ? new Date(data.dueTime.getTime() - data.dueTime.getTimezoneOffset() * 60000).getSeconds() : 0;

            const combinedDateTime = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), hours, minutes, seconds, 0);

            return combinedDateTime.toISOString();
      };

      const formateDeadline = data => {
            return {has_deadline: data.hasDeadLine, ...(data.hasDeadLine ? {due_date: formatDateTime(data)} : {})};
      };

      const onSubmit = data => {
            console.log('data.product.length : ', data);

            if (!data.product.length) {
                  setError('productSelection', {message: 'Please select product'});
                  return;
            }

            const body = {
                  deadline: formateDeadline(data),
                  client_id: data.partyName,
                  product: data.product.map(el => {
                        const {cartoonOption, cartoonType, customCartoonSize} = data?.[el.value];

                        let cartoonPayload = {cartoonOption};

                        if (cartoonOption === 'hasCartoon') {
                              cartoonPayload.cartoonType = cartoonType;
                        } else if (cartoonOption === 'customSize') {
                              cartoonPayload.customCartoonSize = customCartoonSize;
                        }

                        return {
                              id: el.value,
                              box: data?.[el.value].boxType,
                              color: data?.[el.value].colorType,
                              quantity: data?.[el.value].quantity,
                              note: data?.[el.value].notes,
                              cartoon: cartoonPayload,
                        };
                  }),
            };

            placeOrder(body);
      };

      const placeOrder = async body => {
            setIsLoadingPlaceOrder(true);

            try {
                  const response = await API.post('/user/orders', body);

                  console.log('response : ', response.success);

                  if (response.success) {
                        reset();
                        onSelectProduct([]);
                  }
            } catch (error) {
                  console.log('error : ', error);
                  Alert.alert('Error', error?.message || 'Something went wrong. Please try again.');
            } finally {
                  setIsLoadingPlaceOrder(false);
            }
      };

      const [selectedProductMultiSelection, setSelectedProductMultiSelection] = useState([]);

      const onSelectProduct = product => {
            const selectedProduct = productList.filter(el => product.map(prodEl => prodEl.value).includes(el.value));

            setSelectedProductMultiSelection(product);

            clearErrors('product');
            clearErrors('productSelection');

            setValue('product', selectedProduct);
      };

      const [clientList, setClientList] = useState([]);

      const [productList, setProductList] = useState([]);

      const fetchClientList = async () => {
            try {
                  const response = await API.get('/admin/clients');

                  setClientList(response.clients.map(el => ({label: el.name, value: el._id})));
            } catch (error) {
                  console.error('Error API.get(/admin/clients:', error);
            }
      };

      const formatProducts = product => {
            setValue(
                  `${product._id}.cartoonMenuItem`,
                  product.cartoon.map(el => ({label: el.name, value: el._id})),
            );

            setValue(
                  `${product._id}.boxMenuItem`,
                  product.box.map(el => ({label: el.name, value: el._id})),
            );

            setValue(
                  `${product._id}.colorMenuItem`,
                  product.color.map(el => ({label: el.name, value: el._id})),
            );
      };

      const fetchProductList = async () => {
            try {
                  const response = await API.get('/product');

                  setProductList(
                        response.products.map(el => {
                              formatProducts(el);
                              return {label: el.name, value: el._id};
                        }),
                  );
            } catch (error) {
                  console.error('Error API.get(/product?page:', error);
            }
      };

      useEffect(() => {
            fetchClientList();
            fetchProductList();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const watchedProducts = watch('product');

      const [showProductDetails, setShowProductDetails] = useState([]);

      const customTheme = {
            ...DefaultTheme,
            colors: {
                  ...DefaultTheme.colors,
                  primary: '#3e4a57',
            },
      };

      const formattedDate = format(date, 'dd/MM/yyyy');

      const formattedTime = format(time, 'hh:mm a');

      return (
            <PaperProvider theme={customTheme}>
                  <View style={styles.container}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                              <View style={{paddingVertical: 10}}>
                                    <Controller
                                          control={control}
                                          render={({field: {onChange, value}}) => (
                                                <DropdownComponent label="Client" menuItems={clientList} value={value} onChange={onChange} />
                                          )}
                                          name="partyName"
                                          defaultValue=""
                                          rules={{required: 'Please select client'}}
                                    />

                                    {errors.partyName ? <ErrorMessage errors={errors.partyName} /> : <></>}
                              </View>

                              <View style={{}}>
                                    <MultiSelectComponent
                                          selected={selectedProductMultiSelection}
                                          menuItems={productList ?? []}
                                          label="Select Product"
                                          setSelected={onSelectProduct}
                                    />
                                    {errors.productSelection ? <ErrorMessage errors={errors.productSelection} /> : <></>}
                              </View>

                              {watchedProducts?.map(product => {
                                    return (
                                          <OrderItem
                                                key={product.value}
                                                product={product}
                                                control={control}
                                                watch={watch}
                                                errors={errors}
                                                setShowProductDetails={setShowProductDetails}
                                                isSubmitting={isSubmitting}
                                                showProductDetails={showProductDetails}
                                          />
                                    );
                              })}

                              <View
                                    style={{
                                          paddingHorizontal: 16,
                                          paddingVertical: 4,
                                          borderWidth: 0.2,
                                          marginTop: 10,
                                          borderRadius: 8,
                                          borderColor: Colors.label,
                                    }}>
                                    <Controller
                                          control={control}
                                          name={'hasDeadLine'}
                                          defaultValue={false}
                                          render={({field: {onChange, value}}) => (
                                                <View style={{...styles.radioGroupContainer}}>
                                                      <Text style={styles.label}>Delivery Time :</Text>
                                                      <RadioButton.Group onValueChange={onChange} value={value}>
                                                            <View style={styles.radioButtonContainer}>
                                                                  <RadioButton.Item
                                                                        label="No"
                                                                        value={false}
                                                                        style={styles.radioItem}
                                                                        labelStyle={styles.radioLabel}
                                                                  />
                                                                  <RadioButton.Item
                                                                        label="Yes"
                                                                        value={true}
                                                                        style={styles.radioItem}
                                                                        labelStyle={styles.radioLabel}
                                                                  />
                                                            </View>
                                                      </RadioButton.Group>
                                                </View>
                                          )}
                                    />
                                    {watch('hasDeadLine') && (
                                          <View style={styles.dateTimeContainer}>
                                                <Button
                                                      mode="outlined"
                                                      onPress={() => setShowDatePicker(true)}
                                                      textColor={Colors.label}
                                                      style={styles.dateButton}>
                                                      {/* {date.toLocaleDateString()} */}
                                                      {formattedDate}
                                                </Button>
                                                <Button
                                                      mode="outlined"
                                                      onPress={() => setShowTimePicker(true)}
                                                      style={styles.dateButton}
                                                      textColor={Colors.label}>
                                                      {/* {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} */}
                                                      {formattedTime}
                                                </Button>
                                          </View>
                                    )}
                              </View>

                              <View style={{height: 100}} />
                        </ScrollView>

                        <View style={styles.fixedBottomContainer}>
                              {showDatePicker && (
                                    <DateTimePicker
                                          value={date}
                                          mode="date"
                                          display="default"
                                          onChange={(event, selectedDate) => {
                                                setShowDatePicker(false);
                                                setDate(selectedDate || date);
                                                setValue('dueDate', selectedDate || date);
                                          }}
                                    />
                              )}

                              {showTimePicker && (
                                    <DateTimePicker
                                          value={time}
                                          mode="time"
                                          display="default"
                                          onChange={(event, selectedTime) => {
                                                setShowTimePicker(false);
                                                setTime(selectedTime || time);
                                                setValue('dueTime', selectedTime || time);
                                          }}
                                    />
                              )}

                              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 6}}>
                                    <Button
                                          mode="outlined"
                                          textColor="#555555"
                                          onPress={() => {
                                                reset();
                                          }}
                                          style={styles.submitButton}>
                                          Clear
                                    </Button>

                                    {isLoadingPlaceOrder ? (
                                          <ActivityIndicator
                                                style={{height: 'auto', justifyContent: 'center', margin: 'auto'}}
                                                animating={true}
                                                color={'#000000'}
                                          />
                                    ) : (
                                          <Button
                                                mode="contained"
                                                onPress={handleSubmit(onSubmit)}
                                                style={{height: 50, width: '48%', justifyContent: 'center'}}>
                                                Place Order
                                          </Button>
                                    )}
                              </View>
                        </View>
                  </View>
            </PaperProvider>
      );
}

const styles = StyleSheet.create({
      radioGroupContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
      },
      label: {
            marginRight: 8,
            fontSize: 16,
            color: Colors.label,
      },
      radioButtonContainer: {
            flexDirection: 'row',
            gap: 4,
      },
      radioItem: {
            paddingHorizontal: 0,
      },
      radioLabel: {
            fontSize: 16,
            color: Colors.label,
      },
      container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
      },
      scrollContainer: {
            paddingHorizontal: 16,
      },
      input: {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
      },
      productContainer: {
            padding: 16,
            borderWidth: 0.2,
            borderRadius: 8,
            marginTop: 16,
            borderColor: Colors.label,
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
            color: Colors.label,
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
            color: Colors.label,
            borderColor: Colors.label,
      },
      submitButton: {
            height: 50,
            width: '48%',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            color: '#000000',
      },
      productHeader: {
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.label,
      },
});
