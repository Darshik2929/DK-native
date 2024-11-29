/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated, TouchableOpacity, TextInput} from 'react-native';
import {Controller} from 'react-hook-form';
import {RadioButton} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ErrorMessage from '../../../components/Error/ErrorMessage.js';
import DropdownComponent from '../../../components/dropdown/Dropdown.js';
import {Colors} from '../../../constants/Colors';

const OrderItem = ({product, control, watch, errors, isSubmitting}) => {
      const selectedRadio = watch(`${product.value}.cartoonOption`);
      const [isOpen, setIsOpen] = useState(false);

      const dropdownAnimation = useRef(new Animated.Value(0)).current;

      const dropdownHeight = dropdownAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, selectedRadio === 'noCartoon' ? 320 : 385],
      });

      const toggleDropdown = () => {
            if (isOpen) {
                  setIsOpen(false);
                  Animated.timing(dropdownAnimation, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: false,
                  }).start(() => setIsOpen(false));
            } else {
                  setIsOpen(true);

                  Animated.timing(dropdownAnimation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: false,
                  }).start(() => setIsOpen(true));
            }
      };

      useEffect(() => {
            const productErrors = errors[product.value];

            if (productErrors) {
                  const hasErrors = Object.keys(productErrors).some(key => productErrors[key]);
                  if (!hasErrors) {
                        return;
                  }

                  setIsOpen(true);

                  Animated.timing(dropdownAnimation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: false,
                  }).start(() => setIsOpen(true));
            } else {
                  setIsOpen(false);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isSubmitting]);

      return (
            <View key={product.value} style={styles.productContainer}>
                  <TouchableOpacity
                        onPress={() => toggleDropdown()}
                        activeOpacity={0.8}
                        style={{
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
                              paddingBottom: isOpen ? 15 : 0,
                        }}>
                        <Text style={styles.productHeader}>{product.label}</Text>
                        <AntDesign name={isOpen ? 'up' : 'down'} size={14} color={Colors.label} />
                  </TouchableOpacity>

                  <Animated.View style={{height: dropdownHeight, overflow: 'hidden'}}>
                        {/* {isOpen && ( */}
                        <>
                              <View style={{marginTop: 3, paddingHorizontal: 1, ...(!isOpen ? {display: 'none'} : {})}}>
                                    <Controller
                                          control={control}
                                          render={({field: {onChange, value}}) => (
                                                <DropdownComponent
                                                      label="Color"
                                                      menuItems={watch(`${product.value}.colorMenuItem`)}
                                                      value={value}
                                                      onChange={onChange}
                                                />
                                          )}
                                          name={`${product.value}.colorType`}
                                          defaultValue=""
                                          rules={{required: 'Please select color'}}
                                    />
                                    {!!errors?.[product.value]?.colorType && <ErrorMessage errors={errors[product.value].colorType} />}
                              </View>
                              <View style={{marginTop: 16, paddingHorizontal: 1}}>
                                    <Controller
                                          control={control}
                                          render={({field: {onChange, value}}) => (
                                                <DropdownComponent
                                                      label="Box"
                                                      menuItems={watch(`${product.value}.boxMenuItem`)}
                                                      value={value}
                                                      onChange={onChange}
                                                />
                                          )}
                                          name={`${product.value}.boxType`}
                                          defaultValue=""
                                          rules={{required: 'Please select box'}}
                                    />
                                    {!!errors?.[product.value]?.boxType && <ErrorMessage errors={errors[product.value].boxType} />}
                              </View>
                              <Controller
                                    control={control}
                                    name={`${product.value}.cartoonOption`}
                                    defaultValue="noCartoon"
                                    render={({field: {onChange, value}}) => (
                                          <View style={styles.radioGroupContainer}>
                                                <Text style={styles.label}>Cartoon:</Text>
                                                <RadioButton.Group onValueChange={onChange} value={value}>
                                                      <View style={styles.radioButtonContainer}>
                                                            <RadioButton.Item
                                                                  label="No"
                                                                  value="noCartoon"
                                                                  style={styles.radioItem}
                                                                  labelStyle={styles.radioLabel}
                                                            />
                                                            <RadioButton.Item
                                                                  label="Yes"
                                                                  value="hasCartoon"
                                                                  style={styles.radioItem}
                                                                  labelStyle={styles.radioLabel}
                                                            />
                                                            <RadioButton.Item
                                                                  label="Custom"
                                                                  value="customSize"
                                                                  style={styles.radioItem}
                                                                  labelStyle={styles.radioLabel}
                                                            />
                                                      </View>
                                                </RadioButton.Group>
                                          </View>
                                    )}
                              />
                              {selectedRadio === 'hasCartoon' && (
                                    <View style={{marginBottom: 14, marginTop: 7, paddingHorizontal: 1}}>
                                          <Controller
                                                control={control}
                                                name={`${product.value}.cartoonType`}
                                                defaultValue=""
                                                rules={{required: 'Please select cartoon'}}
                                                render={({field: {onChange, value}}) => (
                                                      <DropdownComponent
                                                            label="Cartoon"
                                                            menuItems={watch(`${product.value}.cartoonMenuItem`)}
                                                            value={value}
                                                            onChange={onChange}
                                                      />
                                                )}
                                          />
                                    </View>
                              )}
                              {selectedRadio === 'customSize' && (
                                    <View style={{marginBottom: 12, paddingHorizontal: 1}}>
                                          <Controller
                                                control={control}
                                                name={`${product.value}.customCartoonSize`}
                                                defaultValue=""
                                                rules={{required: 'Please enter custom size'}}
                                                render={({field: {onChange, value}}) => (
                                                      <TextInput
                                                            placeholder="Custom Size"
                                                            keyboardType="number-pad"
                                                            value={value}
                                                            onChangeText={onChange}
                                                            style={{
                                                                  borderColor: Colors.label,
                                                                  backgroundColor: 'white',
                                                                  borderRadius: 12,
                                                                  padding: 12,
                                                                  shadowColor: '#000',
                                                                  shadowOffset: {width: 0, height: 1},
                                                                  shadowOpacity: 0.2,
                                                                  shadowRadius: 1.41,
                                                                  elevation: 2,
                                                            }}
                                                            autoCapitalize="none"
                                                            spellCheck={false}
                                                      />
                                                )}
                                          />
                                    </View>
                              )}
                              {!!errors?.[product.value]?.cartoonType && <ErrorMessage errors={errors[product.value].cartoonType} />}
                              {!!errors?.[product.value]?.customCartoonSize && <ErrorMessage errors={errors[product.value].customCartoonSize} />}
                              <View style={{marginTop: 0, paddingHorizontal: 1}}>
                                    <Controller
                                          control={control}
                                          render={({field: {onChange, value}}) => (
                                                <TextInput
                                                      placeholder="Quantity"
                                                      keyboardType="number-pad"
                                                      value={value}
                                                      onChangeText={onChange}
                                                      style={{
                                                            backgroundColor: 'white',
                                                            borderColor: Colors.label,
                                                            borderRadius: 12,
                                                            padding: 12,
                                                            shadowColor: '#000',
                                                            shadowOffset: {width: 0, height: 1},
                                                            shadowOpacity: 0.2,
                                                            shadowRadius: 1.41,
                                                            elevation: 2,
                                                      }}
                                                      autoCapitalize="none"
                                                      spellCheck={false}
                                                />
                                          )}
                                          name={`${product.value}.quantity`}
                                          defaultValue=""
                                          rules={{required: 'Please enter quantity'}}
                                    />
                                    {!!errors?.[product.value]?.quantity && <ErrorMessage errors={errors[product.value].quantity} />}
                              </View>
                              <View style={{marginTop: 16, paddingHorizontal: 1}}>
                                    <Controller
                                          control={control}
                                          render={({field: {onChange, value}}) => (
                                                <TextInput
                                                      placeholder="Add Notes"
                                                      label="Add Notes"
                                                      value={value}
                                                      multiline={true}
                                                      numberOfLines={4}
                                                      onChangeText={onChange}
                                                      style={{
                                                            borderColor: Colors.label,
                                                            backgroundColor: 'white',
                                                            borderRadius: 12,
                                                            padding: 12,
                                                            shadowColor: '#000',
                                                            shadowOffset: {width: 0, height: 1},
                                                            shadowOpacity: 0.2,
                                                            shadowRadius: 1.41,
                                                            elevation: 2,
                                                      }}
                                                      autoCapitalize="none"
                                                      spellCheck={false}
                                                />
                                          )}
                                          name={`${product.value}.notes`}
                                          defaultValue=""
                                    />
                              </View>
                        </>
                        {/* )} */}
                  </Animated.View>
            </View>
      );
};

const styles = StyleSheet.create({
      scrollView: {
            // flex: 1, // Ensures the ScrollView takes up the available space
      },
      scrollContent: {
            paddingVertical: 10,
      },
      productContainer: {
            padding: 16,
            borderWidth: 0.2,
            borderRadius: 8,
            marginTop: 16,
            borderColor: Colors.label,
      },
      productHeader: {
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.label,
      },
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
      input: {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
      },
});

export default OrderItem;
