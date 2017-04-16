import React, { Component } from 'react';
import { Text, Dimensions, View } from 'react-native';

class Loading extends Component {
    render() {
        return (
            <View style={styles.wrap}>
                <Text>Loading...</Text>
            </View>
        );
    }
}

const styles = {
    wrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
};

export default Loading;
