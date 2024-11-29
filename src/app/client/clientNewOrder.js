/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Provider as PaperProvider, Button, ActivityIndicator, RadioButton, DefaultTheme} from 'react-native-paper';
import MultiSelectComponent from '../../components/dropdown/MultiSelectionDropdown';
import {useForm, Controller} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import API from '../../api/API';
import OrderItem from '../sales/component/OrderItem';
import {Colors} from '../../constants/Colors';

export default function Index() {
      const {
            control,
            handleSubmit,
            setValue,
            watch,
            formState: {errors},
            setError,
            clearErrors,
      } = useForm({defaultValues: {}});

      const [date, setDate] = React.useState(new Date());
      const [time, setTime] = React.useState(new Date());
      const [showDatePicker, setShowDatePicker] = React.useState(false);
      const [showTimePicker, setShowTimePicker] = React.useState(false);

      const [isLoadingPlaceOrder, setIsLoadingPlaceOrder] = useState(false);

      const reset = () => {
            setValue('product', []);

            setSelectedProductMultiSelection([]);

            setDate(new Date());

            setTime(new Date());
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
            if (!data.product.length) {
                  setError('product', {message: 'Please select product'});
                  return;
            }

            const body = {
                  deadline: formateDeadline(data),
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
                  const response = await API.post('/client/create-order', body);

                  if (response.success) {
                        reset();
                        onSelectProduct([]);
                  }
            } catch (error) {
                  console.log('error : ', error);
            } finally {
                  setIsLoadingPlaceOrder(false);
            }
      };

      const [selectedProductMultiSelection, setSelectedProductMultiSelection] = useState([]);

      const onSelectProduct = product => {
            const selectedProduct = productList.filter(el => product.map(prodEl => prodEl.value).includes(el.value));

            setSelectedProductMultiSelection(product);

            clearErrors('product');

            setValue('product', selectedProduct);
      };

      const [productList, setProductList] = useState([]);

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
                  console.error('Error fetching product:', error);
            }
      };

      useEffect(() => {
            fetchProductList();
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

      return (
            <>
                  <PaperProvider theme={customTheme}>
                        <View style={styles.container}>
                              <ScrollView contentContainerStyle={styles.scrollContainer}>
                                    <View style={{paddingTop: 20}}>
                                          <MultiSelectComponent
                                                selected={selectedProductMultiSelection}
                                                menuItems={productList ?? []}
                                                label="Select Product"
                                                setSelected={onSelectProduct}
                                          />
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
                                                            <Text style={styles.label}>Dead line :</Text>
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
                                                            {date.toLocaleDateString()}
                                                      </Button>
                                                      <Button
                                                            mode="outlined"
                                                            onPress={() => setShowTimePicker(true)}
                                                            style={styles.dateButton}
                                                            textColor={Colors.label}>
                                                            {time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
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
            </>
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
            paddingTop: 4,
            backgroundColor: '#FFFFFF',
            marginTop: 35,
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
