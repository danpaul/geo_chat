/* global navigator */

import _ from 'underscore';
import React, { Component } from 'react';
import { Dimensions, Text, ScrollView, StyleSheet, View } from 'react-native';
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

import AddLocationNote from './AddLocationNote';

import { note } from '../controller';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

class Map extends Component {
    constructor() {
        super();
        this.state = { location: null };
        this.getLocationViewContent = this.getLocationViewContent.bind(this);
        this.addNote = this.addNote.bind(this);
        this.handleBackPress = this.handleBackPress.bind(this);
    }
    getLocations() {
        const self = this;
        return this.props.locations.map(function (l) {
            this.location = l;
            return (<Marker
                key={l.key}
                coordinate={{
                    latitude: l.latitude,
                    longitude: l.longitude
                }}
                pinColor="green"
            >
                <Callout>
                    <Text
                        onPress={function () {
                                    self.handleLocationSelect(this.location);
                                }.bind(this)}
                    >
                        {l.title}
                    </Text>
                </Callout>
            </Marker>);
        });
    }
    getLocationViewContent() {
        if (!this.state.location) return null;
        let location = this.state.location;
        // grab the "live" location from props if one exists
        this.props.locations.forEach((l) => {
            if (l.key === this.state.location.key) {
                location = l;
            }
        });
        const notes = _.map(location.notes, (nIn, k) => {
            const n = nIn;
            n.key = k;
            return n;
        });
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
        this.setState({ location });
    }
    render() {
// asdf
// console.log('rendering...');

// return(<View>
//     <Text>FOOOO</Text>
// </View>);

        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: 37.78825,
                      longitude: -122.4324,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                />
            </View>
            // <MapView
            //     style={{ flex: 1, height: Dimensions.get('window').height - 80 }}
            //     showsUserLocation
            //     followsUserLocation
            //     rotateEnabled={false}
            //     scrollEnabled={false}
            // >
            //     <Modal
            //       animationType={'slide'}
            //       transparent={false}
            //       visible={this.state.location !== null}
            //       style={{
            //           top: 0,
            //           right: 0,
            //           bottom: 0,
            //           left: 0,
            //           backgroundColor: '#FFFFFF'
            //       }}
            //     >
            //      <Container>
            //          <Content>
            //             {this.getLocationViewContent()}
            //          </Content>
            //          <Footer>
            //              <FooterTab>
            //                  <Button full onPress={this.handleBackPress}>
            //                      <Text>Back</Text>
            //                  </Button>
            //              </FooterTab>
            //          </Footer>
            //      </Container>
            //      </Modal>
            //     {this.getLocations()}
            // </MapView>
        );
    }
}

export default Map;
