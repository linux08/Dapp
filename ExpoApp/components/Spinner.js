import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const styles = {
    spinnerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const Spinner = ({ size, color }) => (
    <View style={styles.spinnerStyle}>
        <ActivityIndicator size={size || 'large'} color={color || 'blue'} />
    </View>
);


export default Spinner;
