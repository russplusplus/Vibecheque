import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const Login = props => {

    loadThings = () => {
        fetch('http://192.168.5.38:5000/pics', {method: 'GET'})
            .then((response) => {
                return response.json()
            })
            .then((myJson) => {
                console.log(myJson)
            });

        // axios.get('http://10.100.100.137:5000/pics')
        //     .then((response) => {
        //         console.log('response:', response)
        //     }).catch((error) => {
        //         console.log('Error in GET request', error)
        //     })
    }

    login = () => {
        console.log('in login function');
        fetch('http://192.168.5.38:5000/login', {
            method: 'POST',
            body: {
                "username": "clarkKent",
                "password": "superman"
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((myJson) => {
                console.log(myJson)
            });
    }

    return (
        <>
        <Text>Login page</Text>
        <Button title="Load Things" onPress={loadThings}></Button>
        <Button title="Login" onPress={login}></Button>
        </>
    )
}

export default Login;