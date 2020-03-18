import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";

import Login from './components/Login';
import CameraPage from './components/CameraPage';
import Favorite from './components/Favorite';
import ViewInbox from './components/ViewInbox';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import inboxReducer from './store/reducers/inbox';
import respondingReducer from './store/reducers/responding';
import capturedImageReducer from './store/reducers/capturedImage';

import sendImageSaga from './store/sagas/sendImageSaga';

const rootReducer = combineReducers({
  inbox: inboxReducer,
  responding: respondingReducer,
  capturedImage: capturedImageReducer
})

function* rootSaga() {
  yield all([
    sendImageSaga(),

  ]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

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
