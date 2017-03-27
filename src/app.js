/*eslint no-underscore-dangle: ["error", { "allow": ["_root"] }]*/
/* global navigator */

// import _ from 'underscore';
import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'firebase';
import { Container,
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
import GeoFire from 'geofire';

import { Spinner } from './components/common';
import LoginForm from './components/LoginForm';
import SideBar from './components/SideBar';
import Map from './components/Map';
import AddLocationNote from './components/AddLocationNote';
import config from './config';
import { location } from './controller';

const MARKER_SUBSCRIBE_RADIUS = 20; // distance in KM

class App extends Component {


  constructor() {
      super();
      this.state = {
          activeTab: 'map', // either place or map
          locations: [],
          loggedIn: null,
          latitude: null,
          longitude: null
      };
      this.listeners = {};
      this.addLocation = this.addLocation.bind(this);
      this.closeDrawer = this.closeDrawer.bind(this);
      this.openDrawer = this.openDrawer.bind(this);
  }
  componentWillMount() {
      firebase.initializeApp(config.firebase);
      firebase.auth().onAuthStateChanged((user) => {
          if (user) {
              this.setState({ loggedIn: true });
          } else {
              this.setState({ loggedIn: false });
          }
      });
      this.geoFire = new GeoFire(firebase.database().ref('/locations-geofire'));
  }
  componentDidMount() {
      let initialized = false;
      this.watchID = navigator.geolocation.watchPosition(({ coords:
                                                          { latitude, longitude } }) => {
        if (!initialized) {
            initialized = true;
            this.geoQuery = this.geoFire.query({
              center: [latitude, longitude],
              radius: MARKER_SUBSCRIBE_RADIUS
            });
            this.geoQuery.on('key_entered', (key) => {
                // get the location data
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
                // this.state.listeners.key = this.listeners.key.bind(this);
                firebase.database().ref(`/locations/${key}`).on('value', this.listeners[key]);
            });
            this.geoQuery.on('key_exited', (key) => {
                const locations = this.state.locations.filter(l => l.key !== key);
                this.setState({ locations });
                firebase.database().ref(`/locations/${key}`).off('value', this.listeners[key]);
                delete this.listeners[key];
            });
        }
      });
  }
  componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
  }
  getContent() {
      switch (this.state.loggedIn) {
        case true:
            if (this.state.activeTab === 'map') {
                return (<Map locations={this.state.locations} />);
            }
            return (<AddLocationNote
                isNote={false}
                addLocation={this.addLocation}
            />);
        case false:
            return <LoginForm />;
        default:
            return (
                <View style={{ marginTop: 20, height: 45 }}>
                    <Spinner size="large" />
                </View>
            );
        }
  }
  getFooter() {
      if (!this.state.loggedIn) { return null; }
      return (<Footer>
          <FooterTab>
              <Button
                  onPress={() => { this.selectTab('map'); }}
                  active={this.state.activeTab === 'map'}
              >
                  <Icon name="navigate" />
              </Button>
              <Button
                  onPress={() => { this.selectTab('place'); }}
                  active={this.state.activeTab === 'place'}
              >
                  <Icon name="flag" />
              </Button>
          </FooterTab>
      </Footer>);
  }
  addLocation(options) {
      location.create(options)
        .then(() => { this.setState({ activeTab: 'map' }); })
        .catch((err) => {
            // TODO: add error handling
            console.warn('App.addLocation: ', err);
        });
  }
  logout() {
    firebase.auth().signOut();
  }
  openDrawer() {
    this.drawer._root.open();
  }
  closeDrawer() {
    this.drawer._root.close();
  }
  selectTab(activeTab) {
      this.setState({ activeTab });
  }
  render() {
      return (
          <Drawer
            ref={(ref) => { this.drawer = ref; }}
            content={<SideBar logout={this.logout} closeDrawer={this.closeDrawer} />}
            onClose={() => this.closeDrawer()}
          >
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={this.openDrawer} >
                            <Icon name='menu' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Map Chat</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    {this.getContent()}
                </Content>
                {this.getFooter()}
            </Container>
        </Drawer>
    );
  }
}

export default App;
