import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error saving data', e);
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('Error fetching data', e);
  }
};

export const clearData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error clearing data', e);
  }
};
