import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage } from 'react-native';

const IPAddress = '192.168.1.52';

const Camera = props => {

    const [accessToken, setAccessToken] = useState('');

    toLogin = () => {
        props.history.push('/');
    }

    async function getToken() {
        try {
            const token = await AsyncStorage.getItem("access_token")
            console.log('getToken token:', token);
            return token;
        } catch (error) {
            console.log('AsyncStorage retrieval error:', error.message);
        }
        return '(missing token)';
    }

    useEffect(() => {
        getToken()
            .then(response => {
                console.log('in new .then. token:', response)
                setAccessToken(response);
            }).catch(error => {
                console.log('in catch,', error)
            });
        console.log('in useEffect');
      //  console.log(`getToken():`, getToken())  //put a request to the pics route here to see if JWT verificaioin works
        console.log(accessToken);
        fetch('http://192.168.1.52:5000/pics', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken
            }
        })
            .then((response) => {
              //  console.log('in first .then. response:', response);
                return response.json()
            })
            .then((myJson) => {

                console.log('pics:', myJson)
            });
    });

    return (
        <>
        <Text>Camera page</Text>
        <Button title="Back to Login" onPress={toLogin}></Button>
        </>
    )
}

export default Camera;