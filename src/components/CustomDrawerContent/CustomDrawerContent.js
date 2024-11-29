import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = props => {
  const {setAuthToken, setIsClient} = props;

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setAuthToken(null);
      setIsClient(false);
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContainer}>
        <ImageBackground
          source={require('../../assets/images/dkLogo.png')}
          style={styles.backgroundImage}>
          <View style={styles.headerContainer}>
            {/* <Text style={styles.headerText}>My App</Text> */}
          </View>
        </ImageBackground>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#2d343b',
  },
  drawerContainer: {
    // backgroundColor: "#000",
    // backgroundColor: "#2d343b",
  },
  backgroundImage: {
    padding: 20,
    marginBottom: 20,
    height: 62,
    width: 190,
    justifyContent: 'center',
    marginLeft: 40,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#ffe3bf',
    alignItems: 'center',
  },
  logoutText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
