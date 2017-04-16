/* global navigator */
/**
    Component used for adding locations and location notes
*/

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Form, Item, Input, Button } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';

import { location, note } from '../controller';

class AddLocationNote extends Component {
    constructor() {
        super();
        this.state = { title: '',
                       message: '',
                       latitude: null,
                       longitude: null,
                       submitting: false,
                       error: '' };
        // this.istener
        this.clear = this.clear.bind(this);
        navigator.geolocation.getCurrentPosition(({ coords:
                                                  { latitude, longitude } }) => {
            this.setState({ latitude, longitude });
        }, (err) => { console.warn(err); });
    }
    // componentDidMount() {
    //     if( this.props.isNote ){
    //         // get the location data and create a listener for changes
    //         let listener = (snapshot) => {
    //             const locationData = snapshot.val();
    //             if (!locationData) return;
    //             locationData.key = snapshot.key;
    //             let foundMatch = false;
    //             const locations = this.state.locations.map((l) => {
    //                 if (l.key !== locationData.key) { return l; }
    //                 foundMatch = true;
    //                 return locationData;
    //             });
    //             if (!foundMatch) { locations.push(locationData); }
    //             this.setState({ locations });
    //         };
    //         listener = listener.bind(this);
    //         this.listeners[key] = listener;
    //         firebase.database().ref(`/locations/${key}`).on('value', this.listeners[key]);
    //     }
    // }
    getTitle() {
        if (this.props.isNote) return null;
        return (<Item>
            <Input
                onChangeText={title => this.setState({ title })}
                value={this.state.title}
                placeholder="Title"
            />
        </Item>);
    }
    clear(callback = () => {}) {
        this.setState({ title: '', message: '', submitting: false, error: '' },
                      callback);
    }
    isValid() {
        const { title, message } = this.state;
        if (this.props.isNote) return message.length > 3;
        return title.length > 1 && message.length > 3;
    }
    handleLocationSubmit() {
        this.setState({ submitting: true });
        if (this.props.isNote) {
            note.addNote({ message: this.sate.message, locationId: this.props.locationId })
                .then(() => { this.clear(); })
                .catch((err) => {
                    const error = err.message ? err.message : 'An error occurred';
                    this.clear(() => { this.setState({ error }); });
                });
        } else {
            location.create(this.state)
                .then(() => {
                    this.clear(() => {
                        Actions.map();
                    });
                })
                .catch((err) => {
                    const error = err.message ? err.message : 'An error occurred';
                    this.clear(() => { this.setState({ error }); });
                });
        }
    }
    render() {
// asdf
console.log('this.props', this.props)

        return (
            <View style={{ padding: 5, paddingTop: 80 }}>
                <Form>
                    {this.getTitle()}
                    <Item last style={{ marginTop: 5, marginBottom: 5 }}>
                        <Input
                            style={{ height: 100 }}
                            multiline
                            placeholder="Message"
                            value={this.state.message}
                            onChangeText={message => this.setState({ message })}
                        />
                    </Item>
                    <Text style={styles.errorTextStyles}>
                        {this.state.error}
                    </Text>
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

const styles = {
    errorTextStyles: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
};

export default AddLocationNote;
