/*eslint no-underscore-dangle: ["error", { "allow": ["_root"] }]*/
import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'firebase';
import { Footer,
         FooterTab,
         Button,
         Icon } from 'native-base';
import { Scene, Router, Modal, Actions, ActionConst } from 'react-native-router-flux';

import { Spinner } from './components/common';
import LoginForm from './components/LoginForm';
import Map from './components/Map';
import AddLocationNote from './components/AddLocationNote';
import Loading from './components/Loading';
import TabIcon from './components/TabIcon';

import config from './config';
import { location } from './controller';

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
  }
  componentDidMount() {
      firebase.initializeApp(config.firebase);
      firebase.auth().onAuthStateChanged((user) => {
          if (!user) Actions.login({ type: ActionConst.RESET });
          else Actions.mapTab({ type: ActionConst.RESET });
      });
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
  render() {
      return (<Router>
          <Scene key="modal" component={Modal} >
              <Scene key="root">
                  <Scene
                    key="loading"
                    component={Loading}
                    title="Loading"
                    initial
                  />
                  <Scene
                    key="login"
                    component={LoginForm}
                    title="Sign In"
                    formType="login"
                  />
                  <Scene
                    key="register"
                    component={LoginForm}
                    title="Sign In"
                    formType="register"
                  />
                  <Scene
                    key="addNote"
                    component={AddLocationNote}
                    title="Add Note"
                    isNote
                  />
                  <Scene
                    key="mapTab"
                    tabs
                    tabBarStyle={style.tabBarStyle}
                  >
                      <Scene
                        key="map"
                        component={Map}
                        title="Map"
                        icon={TabIcon}
                      />
                      <Scene
                        key="addLocation"
                        component={AddLocationNote}
                        title="Add Location"
                        isNote={false}
                        icon={TabIcon}
                      />
                </Scene>
              </Scene>
          </Scene>
      </Router>);
  }
}

const style = {
    tabBarStyle: {
        // borderTopWidth: 0.5,
        borderColor: '#b7b7b7',
        backgroundColor: 'white',
        opacity: 1
    }
};

export default App;
