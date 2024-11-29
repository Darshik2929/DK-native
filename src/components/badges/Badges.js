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
                        right: -10,
                        top: 0,
                        backgroundColor: 'red',
                        borderRadius: 10,
                        width: 15,
                        height: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1, // Make sure it stays on top
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>{count}</Text>
            </View>
      );
};

export default Badge;
