/* global navigator */

import React, { Component } from 'react';
import { Dimensions, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

class Map extends Component {
    state = {
        latitude: null,
        longitude: null
    };
    componentDidMount() {
        this.watchID = navigator.geolocation.watchPosition(({ coords:
                                                            { latitude, longitude } }) => {
            this.setState({ latitude, longitude }, () => {
                console.log('position updated: ', latitude, longitude);
            });
        });
    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }
    render() {
        if (this.state.latitude === null) { return null; }
        return (
            <MapView
                style={{ flex: 1, height: Dimensions.get('window').height - 80 }}
                showsUserLocation
                followsUserLocation
                rotateEnabled={false}
                scrollEnabled={false}
                // initialRegion={{
                //     latitude: this.state.latitude,
                //     longitude: this.state.longitude,
                //     latitudeDelta: 0.0922,
                //     longitudeDelta: 0.0421,
                // }}
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
