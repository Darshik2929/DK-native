import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import PlaceOrder from '../screens/PlaceOrder/PlaceOrder';
import QuotationOrders from '../screens/QuotationOrders/QuotationOrders';
const Drawer = createDrawerNavigator();

const AppNavigation = () => (
  <Drawer.Navigator initialRouteName="PlaceOrder">
    <Drawer.Screen
      name="PlaceOrder"
      options={{title: 'Place Order'}}
      component={PlaceOrder}
    />
    <Drawer.Screen
      name="Quotation"
      options={{title: 'Quotation'}}
      component={QuotationOrders}
    />
  </Drawer.Navigator>
);

export default AppNavigation;
