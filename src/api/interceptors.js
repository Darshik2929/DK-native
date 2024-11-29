import AsyncStorage from '@react-native-async-storage/async-storage';

export const interceptorsRequest = async request => {
  let authenticationData = await AsyncStorage.getItem('auth_token');

  if (authenticationData) {
    request.headers.Authorization = `Bearer ${authenticationData}`;
  }

  return request;
};

export const interceptorsRequestError = error => {
  throw error;
};

export const interceptorsResponse = response => {
  return response.data;
};

export const interceptorsResponseError = error => {
  throw error;
};
