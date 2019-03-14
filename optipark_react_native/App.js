import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';



import reducers from './src/reducers';

import AppNavigator from './src/navigators/AppNavigator';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));


export default class App extends Component {
  render() {

    return (
      <Provider store={store}>

        
        <AppNavigator />

      </Provider>
    );
  }
}
