import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import Dropdown from '../../components/Dropdown.js';
import API from '../../api/API.js';
import {Button, Card, TextInput, Title} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlaceOrderScreen() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [colour, setColour] = useState([]);
  const [thickness, setThickness] = useState([]);
  const [steelGrade, setSteelGrade] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      productDetails: [],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'productDetails',
  });

  const fetchCategory = async () => {
    console.log('object  22 ');
    try {
      const response = await API.get('/configuration/category');

      console.log('response : ', response);

      setCategories(response.map(el => ({label: el.name, value: el._id})));
    } catch (error) {
      console.log('error ==>', error);
    }
  };

  const fetchProduct = async categoryId => {
    try {
      const response = await API.get(`/product/category/${categoryId}`);
      setProducts(response.map(el => ({label: el.name, value: el._id})));
    } catch (error) {
      console.log('error :  API.get(/product', JSON.stringify(error));
    }
  };

  const fetchData = async (endPoint, setState) => {
    try {
      const response = await API.get(`${endPoint}`);
      setState(response.map(el => ({label: el?.name, value: el?._id})));
    } catch (error) {
      console.log(`error : API.get(/${endPoint} `, error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchData('configuration/colour', setColour);
    fetchData('configuration/steelGrade', setSteelGrade);
    fetchData('configuration/thickness', setThickness);
  }, []);

  const handleChangeCategory = categoryId => {
    setSelectedCategory(categoryId);
    fetchProduct(categoryId);
  };

  const handleSelectProduct = productId => {
    const product = products.find(p => p.value === productId);

    if (product) {
      append({
        productName: product.label,
        product: product.value,
        colour: '',
        thickness: '',
      });

      setSelectedProduct(productId);
    }
  };

  const createOrder = async body => {
    try {
      await API.post('/orders', body);
      reset();
      setSelectedCategory('');
      setSelectedProduct('');
    } catch (error) {
      console.log('error : ', error);
    }
  };

  const onSubmit = async data => {
    const client_id = await AsyncStorage.getItem('client_id');

    const body = {
      client_id,
      order: data.productDetails,
    };

    createOrder(body);
  };

  return (
    <ScrollView style={styles.container}>
      <Dropdown
        menuItems={categories}
        label="Category"
        onChange={handleChangeCategory}
        selected={selectedCategory}
        style={styles.dropdown}
      />

      <View style={{marginVertical: 16}}>
        <Dropdown
          menuItems={products}
          label="Product"
          onChange={handleSelectProduct}
          selected={selectedProduct}
          style={styles.dropdown}
        />
      </View>

      {fields.map((field, index) => (
        <Card key={field.id} style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Title style={styles.productName}>{field.productName}</Title>
              <Button
                mode="text"
                color="red"
                onPress={() => remove(index)}
                labelStyle={styles.removeButton}>
                Remove
              </Button>
            </View>

            <Controller
              control={control}
              name={`productDetails.${index}.colour`}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  menuItems={colour}
                  label="Colour"
                  onChange={onChange}
                  selected={value}
                  style={styles.dropdown}
                />
              )}
            />

            <View style={{marginVertical: 16}}>
              <Controller
                control={control}
                name={`productDetails.${index}.thickness`}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    menuItems={thickness}
                    label="Thickness"
                    onChange={onChange}
                    selected={value}
                    style={styles.dropdown}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name={`productDetails.${index}.steelGrade`}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  menuItems={steelGrade}
                  label="Steel Grade"
                  onChange={onChange}
                  selected={value}
                  style={styles.dropdown}
                />
              )}
            />

            <Controller
              control={control}
              name={`productDetails.${index}.quantity`}
              render={({field: {onChange, value}}) => (
                <TextInput
                  label="Quantity"
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
          </Card.Content>
        </Card>
      ))}

      <Button
        mode="contained"
        style={styles.submitButton}
        labelStyle={styles.submitLabel}
        onPress={handleSubmit(onSubmit)}>
        Submit Order
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dropdown: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: '#ede2c5',
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#6200ee',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 15,
  },
  submitLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
