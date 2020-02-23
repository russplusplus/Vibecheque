import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";

import Login from './components/Login';
import CameraPage from './components/CameraPage';
import Favorite from './components/Favorite';
import ViewInbox from './components/ViewInbox';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import inboxReducer from './store/reducers/inbox';
import respondingReducer from './store/reducers/responding';

const rootReducer = combineReducers({
  inbox: inboxReducer,
  responding: respondingReducer
})

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <NativeRouter>
        <View style={styles.container}>
          <Route exact path="/" component={Login} />
          <Route path="/camera" component={CameraPage} />
          <Route path="/favorite" component={Favorite} />
          <Route path="/viewInbox" component={ViewInbox} />
        </View>
      </NativeRouter>
    </Provider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
  },
});
