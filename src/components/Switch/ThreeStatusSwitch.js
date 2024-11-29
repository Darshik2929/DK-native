import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, Alert} from 'react-native';

const ThreeStatusSwitch = ({status = 'pending', onChange, width}) => {
      const statuses = ['pending', 'active', 'completed'];
      const [currentStatus, setCurrentStatus] = useState(status);
      const [animatedValue] = useState(new Animated.Value(statuses.indexOf(status)));

      useEffect(() => {
            const newIndex = statuses.indexOf(status);
            setCurrentStatus(status);

            Animated.spring(animatedValue, {
                  toValue: newIndex,
                  useNativeDriver: false,
            }).start();
      }, [status]);

      const handlePress = newStatus => {
            const currentIndex = statuses.indexOf(currentStatus);
            const newIndex = statuses.indexOf(newStatus);

            // Allow only moving forward step by step
            if (newIndex !== currentIndex + 1 || currentStatus === 'completed') {
                  return;
            }

            // Show confirmation dialog
            Alert.alert('Confirm Status Change', `Are you sure you want to change the status to ${newStatus}?`, [
                  {
                        text: 'Cancel',
                        style: 'cancel',
                  },
                  {
                        text: 'OK',
                        onPress: () => {
                              setCurrentStatus(newStatus);

                              Animated.spring(animatedValue, {
                                    toValue: newIndex,
                                    useNativeDriver: false,
                              }).start();

                              onChange && onChange(newStatus);
                        },
                  },
            ]);
      };

      const interpolateSwitchPosition = animatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: ['1%', '33%', '68%'], // Adjust these values based on the width of your switch
      });

      return (
            <View style={styles.container}>
                  <View
                        style={[
                              styles.switchBackground,
                              {
                                    backgroundColor: currentStatus === 'completed' ? 'green' : currentStatus === 'active' ? 'yellow' : 'red',
                                    width: width ?? 150,
                              },
                        ]}>
                        {statuses.map((status, index) => (
                              <TouchableOpacity key={index} style={styles.statusButton} onPress={() => handlePress(status)}>
                                    <Text style={styles.statusText}>{''}</Text>
                              </TouchableOpacity>
                        ))}
                        <Animated.View style={[styles.switchHandle, {left: interpolateSwitchPosition}]} />
                  </View>
            </View>
      );
};

const styles = StyleSheet.create({
      container: {},
      switchBackground: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 25,
            position: 'relative',
            height: 30,
      },
      statusButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
      },
      statusText: {
            fontSize: 14,
            color: '#000',
      },
      switchHandle: {
            position: 'absolute',
            top: 1.5,
            bottom: 0,
            width: '30%',
            height: '90%',
            backgroundColor: '#fff',
            borderRadius: 25,
            elevation: 3,
      },
});

export default ThreeStatusSwitch;
