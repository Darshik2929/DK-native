/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
// import * as SplashScreen from 'expo-splash-screen';

export default function AnimatedSplashScreen({onAnimationEnd}) {
  const [logoOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // SplashScreen.preventAutoHideAsync();

    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      onAnimationEnd();
    });
  }, [logoOpacity]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/dkLogo.png')}
        style={[styles.logo, {opacity: logoOpacity}]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#85888b',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
