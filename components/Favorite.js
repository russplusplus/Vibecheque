import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, ImageBackground, TouchableOpacity } from 'react-native';
import { render } from 'react-dom';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';

class Favorite extends React.Component {

    state = {
        accessToken: '',
        favoriteUrl: ''
    }

    getToken = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token")
            console.log('getToken token:', token);
            return token;
        } catch (error) {
            console.log('AsyncStorage retrieval error:', error.message);
        }
        return '(missing token)';
    }

    loadPic = () => {
        console.log('in loadPic')
        fetch('http://192.168.5.67:5000/favorite', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            }
        })
            .then((response) => {
              //  console.log('in first .then. response:', response);
                return response.json()
            })
            .then((myJson) => {
                console.log('favorite:', myJson)
                this.setState({
                    favoriteUrl: myJson[0].favorite_photo_url
                })
                console.log(this.state.favoriteUrl)
            });
    }

    goToCameraPage = () => {
        this.props.history.push('/camera')
    }

    async componentDidMount() {
        console.log('in Favorite componentDidMount');
        await this.getToken()
            .then(response => {
                console.log('in Favorite .then. token:', response)
                this.setState({accessToken: response});
                //setAccessToken('nonsense');
            }).catch(error => {
                console.log('in catch,', error)
            });
        this.loadPic();
    };

    render() {
        return (
            <>
                <View style={{ flex: 1, margin: 0 }}>
                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ url: this.state.favoriteUrl }}>
                        <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}
                                onPress={() => this.cancel()}>
                                <Ionicons
                                    name="md-close"
                                    style={{ color: "#fff", fontSize: 40}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}
                                onPress={() => this.sendImage()}>
                                <Ionicons
                                    name="md-send"
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

export default connect(mapReduxStateToProps)(Favorite);