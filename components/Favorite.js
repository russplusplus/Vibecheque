import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, ImageBackground, TouchableOpacity } from 'react-native';
import { render } from 'react-dom';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';

class Favorite extends React.Component {

    state = {
        accessToken: '',
        favoriteUrl: 'https://miro.medium.com/max/1080/0*DqHGYPBA-ANwsma2.gif'
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
        fetch('http://172.16.102.94:5000/favorite', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            }
        })
        .then((response) => {
            return response.json()
        })
        .then((myJson) => {
            console.log('favorite:', myJson)
            this.setState({
                favoriteUrl: myJson[0].favorite_image_url
            })
            console.log('in second .then, this.state.favoriteUrl:', this.state.favoriteUrl)
        })
        .catch((error) => {
            console.log('error in Favorite loadPic:', error)
        })
    }

    goToCameraPage = () => {
        this.props.history.push('/camera')
    }

    returnToCameraPage = () => {
        console.log('in return function');
        this.props.history.push('/camera');
    }

    deleteFavorite = () => {
        console.log('in delete function');
        fetch('http://172.16.102.94:5000/favorite', {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            }
        })
        console.log('after fetch')
        this.loadPic();
    }

    async componentDidMount() {
        console.log('in Favorite componentDidMount');
        await this.getToken()
            .then(response => {
                console.log('in Favorite .then. token:', response)
                this.setState({accessToken: response});
            }).catch(error => {
                console.log('in catch,', error)
            });
        this.loadPic()
    };

    render() {
        console.log('in render')
        return (
            <>
                <View style={{ flex: 1, margin: 0 }}>
                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: this.state.favoriteUrl }}>
                        <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:10}}>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: '#FFFAAC',
                                    width: 47,
                                    height: 47,
                                    borderWidth: 3,
                                    borderColor: 'black',
                                    borderRadius: 10                    
                                }}
                                onPress={() => this.returnToCameraPage()}>
                                <Ionicons
                                    name="md-return-left"
                                    style={{ 
                                        color: "black", 
                                        fontSize: 40,    
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: '#CC375E',
                                    width: 47,
                                    height: 47,
                                    borderWidth: 3,
                                    borderColor: 'black',
                                    borderRadius: 10                      
                                }}
                                onPress={() => this.deleteFavorite()}>
                                <Ionicons
                                    name="ios-trash"
                                    style={{ color: "black", fontSize: 40}}
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