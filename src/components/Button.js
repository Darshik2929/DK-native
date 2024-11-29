import React from 'react';
import {Button} from 'react-native-paper';

const CustomButton = ({onPress, title}) => {
  return (
    <Button mode="contained" onPress={onPress}>
      {title}
    </Button>
  );
};

export default CustomButton;
