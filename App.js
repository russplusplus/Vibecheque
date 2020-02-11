import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";

import Login from './components/Login';
import CameraPage from './components/CameraPage';
import Favorite from './components/Favorite';
import Report from './components/Report';
import NewPicture from './components/NewPicture';
import Remove from './components/Remove';

export default function App() {
  return (
    <NativeRouter>
      <View style={styles.container}>
        <Route exact path="/" component={Login} />
        <Route path="/camera" component={CameraPage} />
        <Route path="/favorite" component={Favorite} />
        <Route path="/report" component={Report} />
        <Route path="/newpicture" component={NewPicture} />
        <Route path="/remove" component={Remove} /> 
      </View>
    </NativeRouter>
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
