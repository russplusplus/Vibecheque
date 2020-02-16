import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';

class ViewInbox extends React.Component {

    returnToCameraPage = () => {
        this.props.history.push('/camera')
        // delete viewed image from redux and database
    }

    componentDidMount() {
        console.log('reduxState.inbox:', this.props.reduxState.inbox)
    }
    
    render() {
        return (
            <>
                <View style={{ flex: 1, margin: 0 }}>
                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: this.props.reduxState.inbox[0].image_url }}>
                        <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}
                                onPress={() => this.returnToCameraPage()}>
                                <Ionicons
                                    name="md-return-left"
                                    style={{ color: "#fff", fontSize: 40}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}
                                onPress={() => this.deleteFavorite()}>
                                <Ionicons
                                    name="ios-trash"
                                    style={{ color: "#fff", fontSize: 40}}
                                />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </>
        )
    }
}
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(ViewInbox);