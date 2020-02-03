import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const Login = props => {

    loadThings = () => {
        axios.get('https://www.facebook.com')
            .then((response) => {
                console.log('response:', response)
            }).catch((error) => {
                console.log('Error in GET request', error)
            })
    }

    return (
        <>
        <Text>Login page</Text>
        <Button title="Load Things" onPress={loadThings}></Button>
        </>
    )
}

export default Login;