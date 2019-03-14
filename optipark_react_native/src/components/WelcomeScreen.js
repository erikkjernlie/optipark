import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { Dimensions } from "react-native";


var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full heigh
import { Speech } from 'expo';
export class WelcomeScreen extends Component {




    constructor(props) {
        super(props);
    }
    t
    componentWillMount() {
        setTimeout(() => {
            this.props.navigation.navigate('LoginScreen')
        }, 2000);
    }




    render() {
        const { navigate } = this.props.navigation;


        return (
            <View style={{
                paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
                flex: 1,
                alignItems: 'center',
            }}>
                <View>
                    <Text style={styles.text1}>OPTI<Text style={styles.text2}>PARK</Text></Text>
                </View>
                <Image
                    style={styles.stretch}
                    source={{ uri: 'https://experts.re/wp-content/uploads/2017/11/people.png' }}
                />
                <TouchableOpacity onPress={() => { navigate('LoginScreen') }}>
                    <View style={{
                        backgroundColor: '#328ae3', alignItems: 'center', width: 200, height: 40,
                        justifyContent: 'center', borderRadius: 5, marginTop: 50,
                    }}
                    >
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Go to Login</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigate('RegisterScreen') }}>
                    <View style={{
                        backgroundColor: '#328ae3', alignItems: 'center', width: 200, height: 40,
                        justifyContent: 'center', borderRadius: 5, marginTop: 20,
                    }}
                    >
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Register</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    stretch: {
        width: width * 0.45,
        height: width * 0.45,
        marginTop: 40,
        marginBottom: 20,

    },
    text: {
        fontSize: 40,
        paddingBottom: 70,
        paddingTop: 60,
        fontWeight: 'bold',
        fontFamily: 'Cochin',
        textAlign: 'center'

    },
    button: {
        width: width,
        paddingTop: 50,
    },
    text1: {
        fontSize: 50,
        fontWeight: 'bold',
        paddingTop: 50,
        fontFamily: 'Cochin',
        textAlign: 'center',
        color: '#328ae3'

    },
    text2: {
        fontSize: 50,
        paddingTop: 50,
        fontWeight: 'bold',
        fontFamily: 'Cochin',
        color: 'black',
        textAlign: 'center'
    },
});

export default WelcomeScreen;