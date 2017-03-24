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
import AddLocation from './components/AddLocation';
import config from './config';
import { location } from './controller';

const MARKER_UPDATE_INTERVAL = 5000;
const MARKER_SUBSCRIBE_RADIUS = 20; // distance in KM

class App extends Component {


  constructor() {
      super();
      this.state = {
          activeTab: 'map', // either place or map
          loggedIn: null,
          latitude: null,
          longitude: null
      };
      this.addLocation = this.addLocation.bind(this);
      this.closeDrawer = this.closeDrawer.bind(this);
      this.getMarkers = this.getMarkers.bind(this);
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
    //   var db = admin.database();
    //   var ref = db.ref('/locations/' + event.params.locationId);
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
            this.geoQuery.on('key_entered', (key, keyLocation, distance) => {
                // get the location data
                firebase.database().ref(`/locations/${key}`).once('value', (snapshot) => {
                    const locationData = snapshot.val();
console.log('location', locationData);
                });
            });
            this.geoQuery.on('key_entered', (key, keyLocation, distance) => {
                console.log('TODO: handle key exiting');
            });
        }
        //   this.setState({ latitude, longitude }, () => {
        //       const f =
        //       _.debounce(() => {
          //
        //       }, MARKER_UPDATE_INTERVAL);
        //     //   console.log('position updated: ', latitude, longitude);
        //   });
      });
  }
  componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
  }
  getContent() {
      switch (this.state.loggedIn) {
        case true:
            if (this.state.activeTab === 'map') {
                return (<Map />);
            }
            return (<AddLocation
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
  getMarkers() {
      location.get(this.state)
        .then(() => {
// asdf
        })
        .catch(console.warn);
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
