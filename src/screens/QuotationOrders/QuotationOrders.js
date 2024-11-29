import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import API from '../../api/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Card, Paragraph} from 'react-native-paper';

export default function QuotationOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const client_id = await AsyncStorage.getItem('client_id');

    try {
      const response = await API.post(`/orders/client/${client_id}/status`, {
        admin_price_confirm: true,
        client_confirm: false,
      });
      setOrders(response);
    } catch (error) {
      console.log('error API.post(/orders/status : ', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePlaceOrder = async id => {
    try {
      await API.put(`/orders/${id}/status`, {
        client_confirm: true,
      });
      fetchOrders();
    } catch (error) {
      console.log('error : API.put(/orders', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Button mode="contained" onPress={fetchOrders} style={styles.fetchButton}>
        Fetch Orders
      </Button>

      {orders.map(order => {
        console.log('order : ', order);
        return (
          <Card key={order._id} style={styles.card}>
            <Card.Content>
              <Paragraph style={styles.dateText}>
                Date: {new Date(order.order_date).toLocaleDateString()}
              </Paragraph>
              <View style={styles.detailsContainer}>
                {order?.order?.map((item, index) => (
                  <View key={item._id} style={styles.itemContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.productName}>
                        {item?.product?.code}
                      </Text>
                      <Text style={styles.productName}> {item.quantity}</Text>
                    </View>
                    <Text>Name: {item.product.name}</Text>
                    <Text>Colour: {item.colour.name}</Text>
                    <Text>Thickness: {item.thickness.name}</Text>
                    <Text>Steel Grade: {item.steelGrade.name}</Text>
                    <Text style={styles.productName}>Price: {item.price}</Text>
                    <Text style={styles.productName}>
                      Delivery date: {item.delivery_date}
                    </Text>
                  </View>
                ))}
              </View>
              <Button
                mode="contained"
                style={styles.submitButton}
                labelStyle={styles.submitLabel}
                onPress={() => handlePlaceOrder(order._id)}>
                Place Order
              </Button>
            </Card.Content>
          </Card>
        );
      })}

      <View style={{height: 60}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  fetchButton: {
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#fff',
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    color: '#777',
    marginBottom: 10,
  },
  detailsContainer: {
    marginVertical: 10,
  },
  itemContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusContainer: {
    marginTop: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
});
