import React, { Component } from 'react'
import { Button } from 'react-native'


export class FetchLocation extends Component {

    constructor(props) {
        super(props);
    }
    //  <Button 
    render() {
        return (
            <>
                <Button title="Get location" onPress={this.props.onGetLocation()} />
            </>
        );
    }
}



export default (FetchLocation)