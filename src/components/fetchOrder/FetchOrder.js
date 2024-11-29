import React from 'react';
import {ActivityIndicator, Button, Text} from 'react-native-paper';
import IconsIonicons from 'react-native-vector-icons/Ionicons.js';

export default function FetchComp(props) {
      const {isLoading, fetchFunc, label} = props;

      return (
            <>
                  <Button
                        icon={() =>
                              isLoading ? (
                                    <ActivityIndicator animating={true} color="#3e4a57" />
                              ) : (
                                    <IconsIonicons name="reload-circle" size={30} color="#3e4a57" />
                              )
                        }
                        onPress={fetchFunc}
                        disabled={isLoading}>
                        <Text style={{fontSize: 18, paddingVertical: 10}}>{label ?? 'Fetch New Order'}</Text>
                  </Button>
            </>
      );
}
