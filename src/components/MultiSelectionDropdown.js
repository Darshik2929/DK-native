import React, {useState, useRef, useCallback, useEffect} from 'react';
import {StyleSheet, View, Text, Animated, ScrollView, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const MultiSelect = props => {
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
                              <AntDesign style={{color: '#CCC'}} name="delete" size={17} />
                        </View>
                  </TouchableOpacity>
            </View>
      );

      const dropdownHeight = dropdownAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, menuItems.length > 3 ? 126 : menuItems.length * 42],
      });

      return (
            <View style={styles.container}>
                  <TouchableOpacity onPress={toggleDropdown} activeOpacity={0.8} style={styles.header}>
                        <Text style={styles.placeholderStyle}>{selected.length > 0 ? `${selected.length} items selected` : label}</Text>
                        <AntDesign name={isOpen ? 'up' : 'down'} size={14} color={'#CCC'} />
                  </TouchableOpacity>
                  {isOpen && (
                        <Animated.View style={[styles.dropdown, {height: dropdownHeight}]}>
                              <ScrollView>
                                    {menuItems.map(item => (
                                          <TouchableOpacity key={item.value} style={styles.item} onPress={() => onChangeHandler(item)}>
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

export default MultiSelect;

const styles = StyleSheet.create({
      container: {
            backgroundColor: 'white',
      },
      header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
            borderColor: '#CCC',
            borderRadius: 8,
            backgroundColor: 'white',
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
            color: '#CCC',
      },
      selectedTextStyle: {
            fontSize: 14,
            color: '#CCC',
      },
      iconStyle: {
            width: 20,
            height: 20,
            color: '#CCC',
      },
      item: {
            padding: 12,
            borderBottomWidth: 0.5,
            borderBottomColor: '#ccc',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#CCC',
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
            color: '#CCC',
      },
      textSelectedStyle: {
            marginRight: 5,
            fontSize: 16,
            color: '#CCC',
      },
      selectedContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
      },
      itemText: {
            fontSize: 16,
            color: '#CCC',
      },
});
