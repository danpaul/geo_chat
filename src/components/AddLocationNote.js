/* global navigator */
/**
    Component used for adding locations and location notes
*/

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Form, Item, Input, Button } from 'native-base';

class AddLocationNote extends Component {
    constructor() {
        super();
        this.state = { title: '', message: '', latitude: null, longitude: null, submitting: false };
        navigator.geolocation.getCurrentPosition(({ coords:
                                                  { latitude, longitude } }) => {
            this.setState({ latitude, longitude });
        }, (err) => { console.warn(err); });
    }
    getTitle() {
        if (this.props.isNote) return null;
        return (<Item>
            <Input
                onChangeText={title => this.setState({ title })}
                placeholder="Title"
            />
        </Item>);
    }
    clear() {
        this.setState({ title: '', message: '', submitting: false });
    }
    isValid() {
        const { title, message } = this.state;
        if (this.props.isNote) return message.length > 3;
        return title.length > 1 && message.length > 3;
    }
    handleLocationSubmit() {
        this.setState({ submitting: true });
        if (this.props.isNote) this.props.addNote(this.state.message);
        else this.props.addLocation(this.state);
    }
    render() {
        return (
            <View style={{ padding: 5 }}>
                <Form>
                    {this.getTitle()}
                    <Item last style={{ marginTop: 5, marginBottom: 5 }}>
                        <Input
                            style={{ height: 100 }}
                            multiline
                            placeholder="Message"
                            onChangeText={message => this.setState({ message })}
                        />
                    </Item>
                    <Button
                        full
                        onPress={() => { this.handleLocationSubmit(); }}
                        disabled={this.state.submitting || !this.isValid()}
                    >
                        <Text>Add</Text>
                    </Button>
                </Form>
            </View>
        );
    }
}

export default AddLocationNote;
