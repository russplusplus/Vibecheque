import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const Login = props => {

    loadThings = () => {
        fetch('http://192.168.1.52:5000/pics', {method: 'GET'})
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

    return (
        <>
        <Text>Login page</Text>
        <Button title="Load Things" onPress={loadThings}></Button>
        </>
    )
}

export default Login;