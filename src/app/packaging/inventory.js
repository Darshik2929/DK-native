/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, Text, PixelRatio} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import PackagingComponent from './components/PackagingComponent/PackagingComponent.js';
import StickerBagComponent from './components/StickerBagComponent/StickerBagComponent.js';
import API from '../../api/API.js';
import {useFocusEffect} from '@react-navigation/native';

const scaleFont = size => {
      const scale = Dimensions.get('window').width / 375;
      const newSize = size * scale;
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default function Inventory(route) {
      const {functions} = route.route.params; // Destructure the passed function

      const [index, setIndex] = useState(0);

      const [routes, setRoutes] = useState([
            {key: 'box', title: 'BOX'},
            {key: 'cartoon', title: 'CARTOON'},
            {key: 'sticker', title: 'STICKER'},
            {key: 'plastic_bag', title: 'BAG'},
      ]);

      const fetchBoxCartoon = async () => {
            try {
                  functions.fetchBoxCartoon();
                  const response = await API.get('/product');

                  const cartoonNo =
                        response?.products?.filter(el => el?.cartoon?.some(filEl => filEl.minimum_quantity > filEl.quantity))?.length || 0;
                  const boxNo = response?.products?.filter(el => el?.box?.some(filEl => filEl.minimum_quantity > filEl.quantity))?.length || 0;
                  setRoutes(prevRoutes =>
                        prevRoutes.map(route =>
                              route.key === 'box'
                                    ? {...route, title: `BOX ${boxNo}`}
                                    : route.key === 'cartoon'
                                    ? {...route, title: `CARTOON ${cartoonNo}`}
                                    : route,
                        ),
                  );
            } catch (error) {
                  console.error('Error fetchBoxCartoon:', error);
            }
      };

      const fetchStickerBag = async () => {
            try {
                  functions.fetchStickerBag();

                  const stResponse = await API.get('/inventory/sticker/components');
                  const plasticBagRes = await API.get('/inventory/plastic_bag/components');

                  const stNo = stResponse.components.filter(el => el.minimum_quantity > el.quantity).length;
                  const bagNo = plasticBagRes.components.filter(el => el.minimum_quantity > el.quantity).length;

                  setRoutes(prevRoutes =>
                        prevRoutes.map(route =>
                              route.key === 'sticker'
                                    ? {...route, title: `STICKER ${stNo}`}
                                    : route.key === 'plastic_bag'
                                    ? {...route, title: `BAG ${bagNo}`}
                                    : route,
                        ),
                  );
            } catch (error) {
                  console.error('Error fetchBoxCartoon:', error);
            }
      };

      useFocusEffect(
            React.useCallback(() => {
                  fetchStickerBag();
                  fetchBoxCartoon();
            }, []),
      );

      const renderScene = ({route}) => {
            switch (route.key) {
                  case 'box':
                        return <PackagingComponent fetchBoxCartoon={fetchBoxCartoon} department="box" />;

                  case 'cartoon':
                        return <PackagingComponent fetchBoxCartoon={fetchBoxCartoon} department="cartoon" />;

                  case 'sticker':
                        return <StickerBagComponent fetchStickerBag={fetchStickerBag} department="sticker" />;

                  case 'plastic_bag':
                        return <StickerBagComponent fetchStickerBag={fetchStickerBag} department="plastic_bag" />;

                  default:
                        return null;
            }
      };

      const renderTabBar = props => {
            return (
                  <TabBar
                        {...props}
                        scrollEnabled={false} // Set to true if you enable scrollable tabs
                        style={styles.tabBar}
                        indicatorStyle={styles.tabIndicator}
                        renderLabel={({route, focused, color}) => {
                              const parts = route.title.split(' ');
                              const textPart = parts[0];
                              const digitPart = parts[1];

                              return (
                                    <View style={{...styles.tabLabel, display: 'flex', flexDirection: 'row'}} numberOfLines={1} ellipsizeMode="tail">
                                          <Text>{textPart}</Text>
                                          {digitPart != 0 && (
                                                <View
                                                      style={{
                                                            borderRadius: 10,
                                                            top:-10,
                                                            width: 25,
                                                            height: 25,
                                                            backgroundColor: 'red',
                                                            color: 'white',
                                                            // borderRadius: 999,
                                                            marginLeft: 2,
                                                            paddingLeft: 2,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                      }}>
                                                      <Text style={{color: 'white',}}>{digitPart}</Text>
                                                </View>
                                          )}
                                    </View>
                              );
                        }}
                  />
            );
      };

      return (
            <View style={styles.container}>
                  <TabView
                        navigationState={{index, routes}}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        renderTabBar={renderTabBar}
                        initialLayout={{width: Dimensions.get('window').width}}
                        style={{flex: 1}}
                  />
            </View>
      );
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
            backgroundColor: 'white',
      },
      tabBar: {
            backgroundColor: '#f5f5f5',
      },
      tabIndicator: {
            backgroundColor: '#3e4a57',
      },
      tabLabel: {
            color: '#3e4a57',
            fontWeight: '600',
            fontSize: scaleFont(14), // Dynamic font size
            textAlign: 'center',
            width: '100%', // Ensures text takes full width of the tab
      },
      scene: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
      },
});
