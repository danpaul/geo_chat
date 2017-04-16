/* global navigator */

import _ from 'underscore';
import React, { Component } from 'react';
import { Dimensions, Text, ScrollView } from 'react-native';
import Modal from 'react-native-root-modal';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Container,
         Card,
         CardItem,
         Content,
         Footer,
         FooterTab,
         Button,
         Body } from 'native-base';
import GeoFire from 'geofire';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

import AddLocationNote from './AddLocationNote';

import { note } from '../controller';

const MARKER_SUBSCRIBE_RADIUS = 20;

class Map extends Component {
    constructor() {
        super();

        this.state = { location: null, locations: [] };

        this.watchID = null;
        this.geoQuery = null;
        this.geoFire = null;
        this.listeners = [];
        this.locations = [];

        this.getLocationViewContent = this.getLocationViewContent.bind(this);
        this.addNote = this.addNote.bind(this);
        this.handleBackPress = this.handleBackPress.bind(this);
    }
    componentDidMount() {
      this.geoFire = new GeoFire(firebase.database().ref('/locations-geofire'));
      this.watchID = navigator.geolocation.watchPosition(({ coords:
                                                          { latitude, longitude } }) => {
        if (this.geoQuery) {
            return this.geoQuery.updateCriteria({
                center: [latitude, longitude],
            });
        }
        this.geoQuery = this.geoFire.query({
            center: [latitude, longitude],
            radius: MARKER_SUBSCRIBE_RADIUS
        });
        this.geoQuery.on('key_entered', (key) => {
            // get the location data and create a listener for changes
            let listener = (snapshot) => {
                const locationData = snapshot.val();
                if (!locationData) return;
                locationData.key = snapshot.key;
                let foundMatch = false;
                const locations = this.state.locations.map((l) => {
                    if (l.key !== locationData.key) { return l; }
                    foundMatch = true;
                    return locationData;
                });
                if (!foundMatch) { locations.push(locationData); }
                this.setState({ locations });
            };
            listener = listener.bind(this);
            this.listeners[key] = listener;
            firebase.database().ref(`/locations/${key}`).on('value', this.listeners[key]);
        });
        this.geoQuery.on('key_exited', (key) => {
            const locations = this.state.locations.filter(l => l.key !== key);
            this.setState({ locations });
            firebase.database().ref(`/locations/${key}`).off('value', this.listeners[key]);
            delete this.listeners[key];
        });
      });
    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
        _.each(this.listeners, (listener, key) => {
            firebase.database().ref(`/locations/${key}`).off('value', this.listeners[key]);
        });
        this.geoQuery.cancel();
    }
    getLocations() {
        const self = this;
        return this.state.locations.map(l =>
            <Marker
                key={l.key}
                coordinate={{
                    latitude: l.latitude,
                    longitude: l.longitude
                }}
                pinColor="green"
            >
                <Callout onPress={function () { self.handleLocationSelect(l); }}>
                    <Text>{l.title}</Text>
                </Callout>
            </Marker>
        );
    }
    getLocationViewContent() {
        if (!this.state.location) return null;
        let location = this.state.location;
        // grab the "live" location from state if one exists
        this.state.locations.forEach((l) => {
            if (l.key === this.state.location.key) location = l;
        });
        let notes = _.map(location.notes, (nIn, k) => {
            const n = nIn;
            n.key = k;
            return n;
        });
        notes = _.sortBy(notes, (n) => -n.timestamp);
        return (<ScrollView>
            <Card style={{ paddingTop: 20 }}>
                <AddLocationNote
                    ref="addLocationNote"
                    isNote
                    key={this.state.location.key}
                    addNote={this.addNote}
                />
            </Card>
            {notes.map(n =>
                <Card key={n.key}>
                    <CardItem>
                        <Body>
                            <Text>{n.message}</Text>
                        </Body>
                    </CardItem>
                </Card>
            )}
        </ScrollView>);
    }
    addNote(message) {
        note.add({ message, locationId: this.state.location.key })
            .then(() => {
                console.log('in then');
                this.refs.addLocationNote.clear();
            })
            .catch(err => console.log(err));
    }
    handleBackPress() {
        this.setState({ location: null });
    }
    handleLocationSelect(location) {
        Actions.addNote({ location });
    }
    render() {
        return (
            <MapView
                style={{ flex: 1, height: Dimensions.get('window').height - 80 }}
                showsUserLocation
                followsUserLocation
                rotateEnabled={false}
                scrollEnabled={false}
            >
                <Modal
                  animationType={'slide'}
                  transparent={false}
                  visible={this.state.location !== null}
                  style={{
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      backgroundColor: '#FFFFFF'
                  }}
                >
                 <Container>
                     <Content>
                        {this.getLocationViewContent()}
                     </Content>
                     <Footer>
                         <FooterTab>
                             <Button full onPress={this.handleBackPress}>
                                 <Text>Back</Text>
                             </Button>
                         </FooterTab>
                     </Footer>
                 </Container>
                 </Modal>
                {this.getLocations()}
            </MapView>
        );
    }
}

export default Map;
