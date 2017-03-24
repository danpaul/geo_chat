import firebase from 'firebase';
import React, { Component } from 'react';
import { Text } from 'react-native';

import { Button, Card, CardSection, Input, Spinner } from './common';

const getDefaultState = function () {
    return { email: '', password: '', error: '', loading: false };
};

class LoginForm extends Component {
    state = getDefaultState();
    onButtonPress() {
        const { email, password } = this.state;
        this.setState({ error: '', loading: true });
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                this.onLoginSuccess();
            })
            .catch(() => {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        this.onLoginSuccess();
                    })
                    .catch((err) => {
                        console.warn(err);
                        this.setState({ loading: false,
                                        error: 'Authentication failed' });
                    });
            });
    }
    onLoginSuccess() {
        this.setState(getDefaultState());
    }
    renderButton() {
        if (this.state.loading) {
            return <Spinner size="small" />;
        }
        return (
            <Button onPress={this.onButtonPress.bind(this)}>
                Log In / Regsiter
            </Button>
        );
    }
    render() {
        return (
            <Card>
                <CardSection>
                    <Input
                        label="Email"
                        placeholder="user@gmail.com"
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        label="Password"
                        placeholder="password"
                        value={this.state.password}
                        secureTextEntry
                        onChangeText={password => this.setState({ password })}
                    />
                </CardSection>
                <Text style={styles.errorTextStyles}>
                    {this.state.error}
                </Text>
                <CardSection>
                    {this.renderButton()}
                </CardSection>
            </Card>
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

export default LoginForm;
