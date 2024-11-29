import {View, Text, TextInput, ScrollView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ActivityIndicator, Button, DefaultTheme, PaperProvider} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import API from '../../../../api/API';
import {useNotificationHandler} from '../../../../../FCMService';

export default function StickerBagComponent(props) {
      const {department, fetchStickerBag} = props;

      const [componentList, setComponentList] = useState([]);

      const {control, handleSubmit, reset} = useForm({defaultValues: {component: []}});

      const fetchComponent = async () => {
            setIsLoading(true);
            try {
                  const response = await API.get(`/inventory/${department}/components`);

                  setComponentList(
                        response.components.map(el => {
                              return {label: el.name, value: el._id, quantity: el.quantity, minimum_quantity: el.minimum_quantity};
                        }),
                  );

                  if (response.success) {
                        setIsLoading(false);
                  }
            } catch (error) {
                  console.log('error ==>', error);
            }
      };

      const {notification} = useNotificationHandler();

      useFocusEffect(
            React.useCallback(() => {
                  fetchComponent();
                  // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [notification]),
      );

      const [isLoading, setIsLoading] = useState(true);

      const updateInventory = async body => {
            setIsLoading(true);

            try {
                  const response = await API.patch(`/inventory/update/${department}`, body);

                  if (response.success) {
                        fetchComponent();
                        reset();
                        fetchStickerBag();
                  }
            } catch (error) {
                  console.log('const error = ', JSON.stringify(error));
            }
      };

      const formatInventory = data => {
            const body = {
                  updates: Object.keys(data)
                        .filter(key => key !== 'component' && data[key].quantity !== '')
                        .map(key => ({
                              _id: key,
                              quantity_change: parseInt(data[key].quantity, 10),
                        })),
            };

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
            <PaperProvider theme={customTheme}>
                  {isLoading ? (
                        <ActivityIndicator
                              style={{height: 'auto', justifyContent: 'center', margin: 'auto', display: 'flex'}}
                              animating={true}
                              color={'#000000'}
                        />
                  ) : (
                        <View style={styles.container}>
                              <ScrollView contentContainerStyle={styles.scrollContainer}>
                                    {componentList.map((el, index) => {
                                          const isMin = el.minimum_quantity > el.quantity;

                                          return (
                                                <View
                                                      key={index}
                                                      style={{
                                                            display: 'flex',
                                                            flexDirection: 'cpl',
                                                            alignItems: 'left',
                                                            justifyContent: 'space-between',
                                                            paddingTop: 6,
                                                            borderBottomWidth: index + 1 === componentList.length ? 0 : 0.3,
                                                            borderBottomColor: '#ccc',
                                                            paddingBottom: 12,
                                                            marginBottom: 12,
                                                            gap: 10,
                                                      }}>
                                                      <Text style={{fontSize: 16}}>
                                                            {el.label} ({el.quantity})
                                                      </Text>

                                                      <Controller
                                                            control={control}
                                                            render={({field: {onChange, value}}) => (
                                                                  <TextInput
                                                                        placeholder="Quantity"
                                                                        value={value}
                                                                        keyboardType="number-pad"
                                                                        onChangeText={onChange}
                                                                        style={{
                                                                              backgroundColor: 'white',
                                                                              borderRadius: 8,
                                                                              height: 40,
                                                                              paddingHorizontal: 10,
                                                                              borderWidth: 0.9,
                                                                              borderColor: isMin ? 'red' : '#ccc',
                                                                              width: 90,
                                                                        }}
                                                                        autoCapitalize="none"
                                                                        spellCheck={false}
                                                                  />
                                                            )}
                                                            name={`${el.value}.quantity`}
                                                            defaultValue=""
                                                      />
                                                </View>
                                          );
                                    })}
                              </ScrollView>
                        </View>
                  )}

                  <View style={styles.fixedBottomContainer}>
                        <Button mode="contained" onPress={handleSubmit(formatInventory)} style={styles.submitButton}>
                              Add Inventory
                        </Button>
                  </View>
            </PaperProvider>
      );
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            padding: 8,
            marginTop: 10,
      },
      scrollContainer: {
            paddingHorizontal: 16,
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
