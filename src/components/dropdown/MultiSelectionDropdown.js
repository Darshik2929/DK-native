import React, {useState, useRef, useCallback, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Animated, ScrollView} from 'react-native';
import {Colors} from '../../constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AnimatedMultiSelectComponent = props => {
      const {menuItems, label, setSelected} = props;
      const [selected, setSelectedState] = useState(props.selected ?? []);
      const [isOpen, setIsOpen] = useState(false);
      const dropdownAnimation = useRef(new Animated.Value(0)).current;

      useEffect(() => {
            setSelectedState(props.selected);
      }, [props.selected]);

      const toggleDropdown = () => {
            if (isOpen) {
                  Animated.timing(dropdownAnimation, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                  }).start(() => setIsOpen(false));
            } else {
                  setIsOpen(true);
                  Animated.timing(dropdownAnimation, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: false,
                  }).start();
            }
      };

      const onChangeHandler = useCallback(
            item => {
                  const updatedSelected = selected.some(i => i.value === item.value)
                        ? selected.filter(i => i.value !== item.value)
                        : [...selected, item];

                  setSelectedState(updatedSelected);
                  if (setSelected) {
                        setSelected(updatedSelected);
                  }
            },
            [selected, setSelected],
      );

      const renderSelectedItem = (item, unSelect) => (
            <View key={item.value}>
                  <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                        <View style={styles.selectedStyle}>
                              <Text style={styles.textSelectedStyle}>{item.label}</Text>
                              <AntDesign style={{color: Colors.label}} name="delete" size={17} />
                        </View>
                  </TouchableOpacity>
            </View>
      );

      const [itemHeights, setItemHeights] = useState([]);

      const updateHeight = (index, height) => {
            setItemHeights(prevHeights => {
                  const newHeights = [...prevHeights];
                  newHeights[index] = height;
                  return newHeights;
            });
      };

      const totalHeight = itemHeights.reduce((acc, height) => acc + height, 0);

      const dropdownHeight = dropdownAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, totalHeight > 200 ? 200 : totalHeight],
      });

      return (
            <View style={styles.container}>
                  <TouchableOpacity onPress={toggleDropdown} activeOpacity={0.8} style={styles.header}>
                        <Text style={styles.placeholderStyle}>{selected.length > 0 ? `${selected.length} items selected` : label}</Text>
                        <AntDesign name={isOpen ? 'up' : 'down'} size={14} color={Colors.label} />
                  </TouchableOpacity>

                  {isOpen && (
                        <Animated.View style={[styles.dropdown, {height: dropdownHeight}]}>
                              <ScrollView>
                                    {menuItems.map((item, index) => (
                                          <TouchableOpacity
                                                key={item.value}
                                                style={styles.item}
                                                onPress={() => onChangeHandler(item)}
                                                onLayout={event => {
                                                      const {height} = event.nativeEvent.layout;
                                                      updateHeight(index, height);
                                                }}>
                                                <Text style={styles.itemText}>{item.label}</Text>
                                          </TouchableOpacity>
                                    ))}
                              </ScrollView>
                        </Animated.View>
                  )}
                  <View style={styles.selectedContainer}>
                        {selected.map(item =>
                              renderSelectedItem(item, () => {
                                    onChangeHandler(item);
                              }),
                        )}
                  </View>
            </View>
      );
};

export default AnimatedMultiSelectComponent;

const styles = StyleSheet.create({
      container: {
            backgroundColor: 'white',
      },
      header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
            borderColor: Colors.label,
            backgroundColor: 'white',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
      },
      dropdown: {
            overflow: 'hidden',
            borderRadius: 8,
            marginTop: 8,
            backgroundColor: '#f7f9fa',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
      },
      placeholderStyle: {
            fontSize: 16,
            color: Colors.label,
      },
      selectedTextStyle: {
            fontSize: 14,
            color: Colors.label,
      },
      iconStyle: {
            width: 20,
            height: 20,
            color: Colors.label,
      },
      item: {
            padding: 12,
            borderBottomWidth: 0.5,
            borderBottomColor: '#ccc',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: Colors.label,
      },
      selectedStyle: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
            backgroundColor: 'white',
            shadowColor: '#000',
            marginTop: 8,
            marginRight: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
            color: Colors.label,
      },
      textSelectedStyle: {
            marginRight: 5,
            fontSize: 16,
            color: Colors.label,
      },
      selectedContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
      },
      itemText: {
            fontSize: 16,
            color: Colors.label,
      },
});
