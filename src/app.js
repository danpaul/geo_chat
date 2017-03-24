/*eslint no-underscore-dangle: ["error", { "allow": ["_root"] }]*/

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

import { Spinner } from './components/common';
import LoginForm from './components/LoginForm';
import SideBar from './components/SideBar';
import Map from './components/Map';
import AddLocation from './components/AddLocation';
import config from './config';
import { location } from './controller';

class App extends Component {


  constructor() {
      super();
      this.state = { activeTab: 'place' }; // either place or map
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
  }
  getContent() {
      switch (this.state.loggedIn) {
        case true:
            if (this.state.activeTab === 'map') {
                return <Map />;
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
                <Footer>
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
                </Footer>
            </Container>
        </Drawer>
    );
  }
}

export default App;
