import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Button, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

import { getGeo } from "../actions/geo";
import { createUser } from '../actions/login';
import { fetchUser } from '../actions/login';
import { Dimensions } from "react-native";


var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full heigh

class RegisterScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            licencePlate: "",
        }
    }

    componentWillMount() {

    }

    componentDidMount() {


    }

    componentDidUpdate() {

    }


    handleEmail = (e) => {
        this.setState({
            email: e.nativeEvent.text,
        })
    }

    handlePassword = (e) => {
        this.setState({
            password: e.nativeEvent.text,
        })
    }
    handleLicencePlate = (e) => {
        this.setState({
            licencePlate: e.nativeEvent.text,
        })
    }

    createUser = () => {
        console.log("START TO CREATE USER")
        this.props.createUser(this.state.email, this.state.password, this.state.licencePlate, this.props.navigation)

    }
    goToHome = () => {
        this.props.navigation.navigate('Home');
    }


    render() {

        return (
            <View style={{
                paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
                flex: 1,
                alignItems: 'center',
            }}>
                <Image
                    style={styles.stretch}
                    source={{ uri: 'https://pngimage.net/wp-content/uploads/2018/06/png-company-register-5.png' }}
                />
                <Input
                    placeholder="E-mail"
                    onChange={this.handleEmail}
                    autoCapitalize='none'
                    value={this.state.email}
                    leftIcon={
                        <Icon
                            name='user'
                            size={24}
                            color='#4dd6de'
                            style={{ paddingRight: 10 }}
                        />
                    }

                />
                <Input
                    placeholder="Password"
                    onChange={this.handlePassword}
                    secureTextEntry={true}
                    autoCapitalize='none'
                    value={this.state.password}
                    leftIcon={
                        <Icon
                            name='lock'
                            size={24}
                            color='#4dd6de'
                            style={{ paddingRight: 10 }}
                        />
                    }
                />
                <Input
                    placeholder="Licence plate"
                    onChange={this.handleLicencePlate}
                    autoCapitalize='none'
                    value={this.state.licencePlate}
                    leftIcon={
                        <Icon
                            name='car'
                            size={14}
                            color='#4dd6de'
                            style={{ paddingRight: 10 }}
                        />
                    }
                />
                <TouchableOpacity onPress={this.createUser}>
                    <View style={{
                        backgroundColor: '#f25119', alignItems: 'center', width: 200, height: 40,
                        justifyContent: 'center', borderRadius: 5, marginTop: 50,
                    }}
                    >
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Register user</Text>
                    </View>
                </TouchableOpacity>
                {this.props.isLoadingRegister ? <ActivityIndicator style={styles.spinner} size="large" color="#4dd6de" /> : <Text></Text>}
                {this.props.authError ? <Text style={styles.warningText}>{this.props.authError}</Text> : <Text></Text>}
            </View>
        );
    }


}

const mapStateToProps = (reducer) => {
    const { isLoadingRegister, authError } = reducer.database;
    return {
        isLoadingRegister: isLoadingRegister,
        authError: authError,
    }

}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ createUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);


//Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
        marginTop: 30,
        marginBottom: 30,
        fontWeight: 'bold',
        fontFamily: 'Cochin',
    },
    stretch: {
        width: width * 0.55,
        height: width * 0.55,
        marginTop: 70,
        marginBottom: 40,

    },
    warningText: {
        color: 'red',
        textAlign: 'center',
        paddingTop: 20,
    },
    spinner: {
        paddingTop: 30
    }
});