/* global navigator */

import _ from 'underscore';
import React, { Component } from 'react';
import { Dimensions, Text, Modal, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Container,
         Card,
         CardItem,
         Drawer,
         Header,
         Title,
         Content,
         Footer,
         FooterTab,
         Button,
         Left,
         Right,
         Body,
         Icon } from 'native-base';

import AddLocationNote from './AddLocationNote';

import { note } from '../controller';

class Map extends Component {
    constructor() {
        super();
        this.state = { location: null };
        this.getLocationViewContent = this.getLocationViewContent.bind(this);
        this.addNote = this.addNote.bind(this);
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
        const notes = _.map(this.state.location.notes, (nIn, k) => {
            const n = nIn;
            n.key = k;
            return n;
        });
        return (<ScrollView>
            <Card style={{ paddingTop: 20 }}>
                <AddLocationNote
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
        note.add({ message, locationId: this.state.location.key });
    }
    handleLocationSelect(location) {
        this.setState({ location });
    }
    render() {
// console.log('this.state.location', this.state.location)
        const modalVisible = this.state.location !== null;
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
                  visible={modalVisible}
                  onRequestClose={() => {alert("Modal has been closed.")}}
                 >
                 <Container>
                     <Content>
                        {this.getLocationViewContent()}
                     </Content>
                     <Footer>
                         <FooterTab>
                             <Button full>
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
