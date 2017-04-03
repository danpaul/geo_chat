import React, { Component } from 'react';
import { Dimensions, View, Text } from 'react-native';
import { Button } from 'native-base';

class Sidebar extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
    }
    logout() {
        this.props.logout();
        this.props.closeDrawer();
    }
    render() {
        const style = {
            width: Dimensions.get('window').width * 0.8,
            height: Dimensions.get('window').height,
            backgroundColor: '#FFFFFF',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: 20
        };
        return (
            <View style={style}>
                <Button light full onPress={this.logout}>
                    <Text>Logout</Text>
                </Button>
            </View>
        );
    }
}

export default Sidebar;
