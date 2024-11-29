import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Text, View, Animated, TouchableOpacity, ScrollView, TouchableWithoutFeedback} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Dropdown = ({label, menuItems, onChange, value}) => {
      const [isOpen, setIsOpen] = useState(false);
      const [selectedValue, setSelectedValue] = useState(value);
      const dropdownAnimation = useRef(new Animated.Value(0)).current;

      useEffect(() => {
            setSelectedValue(value);
      }, [value]);

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

      const dropdownHeight = dropdownAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, menuItems.length > 3 ? 126 : menuItems.length * 42],
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
                                    {selectedValue ? menuItems.find(i => i.value === selectedValue)?.label : `Select ${label}`}
                              </Text>
                              <AntDesign name={isOpen ? 'up' : 'down'} size={14} color={'#ccc'} />
                        </TouchableOpacity>
                        {isOpen && (
                              <Animated.View style={[styles.dropdown, {height: dropdownHeight}]}>
                                    <ScrollView>
                                          {menuItems.map((item, index) => (
                                                <TouchableOpacity key={index} style={styles.item} onPress={() => onItemPress(item)}>
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

export default Dropdown;

const styles = StyleSheet.create({
      container: {
            // backgroundColor: 'white',
      },
      header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
            borderWidth: 0,
            borderColor: '#ccc',
            borderRadius: 8,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
      },
      selectedText: {
            fontSize: 16,
            color: '#000',
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
            color: '#000',
      },
});
