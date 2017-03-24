/* global navigator */

import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

class Map extends Component {
    state = {};
    render() {
        return (
            <MapView
                style={{ flex: 1, height: Dimensions.get('window').height - 80 }}
                showsUserLocation
                followsUserLocation
                rotateEnabled={false}
                scrollEnabled={false}
            />
        );
    }
}

// <Marker
//     coordinate={{
//         latitude: this.state.latitude,
//         longitude: this.state.longitude
//     }}
//     title={'you are here'}
//     description={'test'}
// >
//     <Text>THIS is a test</Text>
// </Marker>
// </MapView>

export default Map;
