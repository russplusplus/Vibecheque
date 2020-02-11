import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage } from 'react-native';
import { render } from 'react-dom';

export default class Favorite extends React.Component {

    state = {
        accessToken: ''
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
        fetch('http://10.100.100.137:5000/favorite', {
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
            });
    }

    async componentDidMount() {
        console.log('in useEffect');
        this.getToken()
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
            <Text>Favorite page</Text>
            </>
        )
    }
    
}