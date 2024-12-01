/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Text, View} from 'react-native';

const Badge = ({count}) => {
      if (count <= 0) {
            return null;
      } // Do not show if count is zero or negative

      return (
            <View
                  style={{
                        position: 'absolute',
                        right: -15,
                        top: -10,
                        backgroundColor: 'red',
                        borderRadius: 10,
                        width: 25,
                        height: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1, // Make sure it stays on top
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>{count}</Text>
            </View>
      );
};

export default Badge;
