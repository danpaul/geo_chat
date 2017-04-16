import firebase from 'firebase';
import React, { Component } from 'react';
import { Text, Dimensions, View } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import { Button, CardSection, Input, Spinner } from './common';

const defaultError = 'Authentication failed';
const getDefaultState = function () {
    return { email: '', password: '', error: '', loading: false };
};

class LoginForm extends Component {
    constructor() {
        super();
        this.state = getDefaultState();
        this.handleFormSwitch = this.handleFormSwitch.bind(this);
    }
    componentWillUpdate(nextProps) {
        if (nextProps.formType !== this.props.formType) {
            this.setState(getDefaultState());
        }
    }
    onButtonPress() {
        this.setState({ error: '', loading: true });
        const { email, password } = this.state;
        const method = this.props.formType === 'login' ?
            firebase.auth().signInWithEmailAndPassword(email, password) :
            firebase.auth().createUserWithEmailAndPassword(email, password);
        method
            .then(this.onLoginSuccess)
            .catch((err) => {
                const error = err.message ? err.message : defaultError;
                this.setState({ loading: false, error });
            });
    }
    onLoginSuccess() {
        Actions.map({ type: ActionConst.RESET });
    }
    handleFormSwitch() {
        const action = this.props.formType === 'login' ? Actions.register : Actions.login;
        const formType = this.props.formType === 'login' ? 'regiser' : 'login';
        action();
        Actions.refresh({ formType });
    }
    renderButton() {
        if (this.state.loading) {
            return <Spinner size="small" />;
        }
        return (
            <Button onPress={this.onButtonPress.bind(this)}>
                {this.props.formType === 'login' ? 'Log In' : 'Register'}
            </Button>
        );
    }
    render() {
        return (
            <View style={styles.formWrap}>
                <View style={styles.cardWrap}>
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
                    <CardSection>
                    <Text style={styles.errorTextStyles}>
                        {this.state.error}
                    </Text>
                    </CardSection>
                    <CardSection>
                        {this.renderButton()}
                    </CardSection>
                    <Text style={styles.linkStyle} onPress={this.handleFormSwitch}>
                        {this.props.formType === 'login' ? 'Register' : 'Log In'}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = {
    formWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: Dimensions.get('window').height
    },
    cardWrap: {
        padding: 5,
        width: Dimensions.get('window').width
    },
    linkStyle: {
        padding: 10,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    errorTextStyles: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
};

export default LoginForm;
