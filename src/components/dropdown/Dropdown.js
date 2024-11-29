import React, {useState, useRef} from 'react';
import {StyleSheet, Text, View, Animated, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../../constants/Colors';

const DropdownComponent = ({label, menuItems, onChange, value}) => {
      const [isOpen, setIsOpen] = useState(false);
      const [selectedValue, setSelectedValue] = useState(value);
      const dropdownAnimation = useRef(new Animated.Value(0)).current;

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

      const onItemPress = item => {
            setSelectedValue(item.value);
            onChange(item.value);
            toggleDropdown();
      };

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

      const handleOutsidePress = () => {
            if (isOpen) {
                  toggleDropdown();
            }
      };

      return (
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                  <View style={styles.container}>
                        <TouchableOpacity onPress={toggleDropdown} activeOpacity={0.8} style={styles.header}>
                              <Text style={styles.selectedText}>
                                    {selectedValue ? menuItems.find(i => i.value === selectedValue).label : `Select ${label}`}
                              </Text>
                              <AntDesign name={isOpen ? 'up' : 'down'} size={14} color={Colors.label} />
                        </TouchableOpacity>
                        {isOpen && (
                              <Animated.View style={[styles.dropdown, {height: dropdownHeight}]}>
                                    <ScrollView>
                                          {menuItems.map((item, index) => (
                                                <TouchableOpacity
                                                      key={index}
                                                      style={styles.item}
                                                      onPress={() => onItemPress(item)}
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
                  </View>
            </TouchableWithoutFeedback>
      );
};

export default DropdownComponent;

const styles = StyleSheet.create({
      container: {
            backgroundColor: 'white',
      },
      header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 0,
            borderColor: Colors.label,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 12,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
      },
      selectedText: {
            fontSize: 16,
            color: Colors.label,
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
      item: {
            padding: 12,
            borderBottomWidth: 0.5,
            borderBottomColor: '#ccc',
      },
      itemText: {
            fontSize: 16,
            color: Colors.label,
      },
});
