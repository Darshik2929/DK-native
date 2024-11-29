import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default function ErrorMessage(props) {
  const {errors} = props;

  return (
    <View>
      <Text style={styles.textStyle}>* {errors.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    color: 'red',
    fontSize: 12,
    marginLeft: 8,
  },
});
