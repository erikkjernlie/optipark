import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, Image, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { Dimensions } from "react-native";
import {getGeo} from '../actions/geo';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full heigh
export class SplashScreen extends Component {




    constructor(props) {
        super(props);
    }
    t
    componentWillMount() {
        console.log("test");
        const { navigate } = this.props.navigation;
        this.props.getGeo("Library");
        setTimeout(() => {
            navigate('WelcomeScreen')
        }, 1000);
        console.log("mounting")
        

    }


    render() {

        return (
            <View style={{
                paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View>
                    <Text style={styles.text1}>OPTI<Text style={styles.text2}>PARK</Text></Text>
                    <Text style={styles.subText}>Finding your optimal parking</Text>
                </View>
                <ActivityIndicator style={styles.spinner} size="large" color="#328ae3" />

                <Image
                    style={styles.stretch}
                    source={{ uri: 'https://www.smartparking.com/media/1427/spjan15-87.jpg' }}
                />
            </View>
        )
    }
};

const styles = StyleSheet.create({
    stretch: {
        width: width * 0.85,
        height: 150,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    text1: {
        fontSize: 50,
        fontWeight: 'bold',
        fontFamily: 'Cochin',
        textAlign: 'center',
        color: '#328ae3'
        
    },
    text2: {
        fontSize: 50,
        fontWeight: 'bold',
        fontFamily: 'Cochin',
        color: 'black',
        textAlign: 'center'
    },
    subText: {
        fontWeight: 'bold',
        fontFamily: 'Cochin',
        paddingBottom: 30,
        textAlign: 'center',
    },
    spinner: {
        paddingBottom: 30
    }
});

const mapStateToProps = (state) => {
    
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({getGeo}, dispatch);
  }

  export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
