import React from 'react';
import {TextInput} from 'react-native-paper';

const Input = ({label, value, onChangeText, secureTextEntry}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      mode="outlined"
    />
  );
};

export default Input;
