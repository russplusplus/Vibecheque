import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage } from 'react-native';
import axios from 'axios';

//const IPAddress = require('../modules/IPAddress');
const IPAddress = '192.168.1.52';

const Login = props => {

    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    async function deviceStorage(item, selectedValue) {
        console.log('in deviceStorage function');
        try {
            await AsyncStorage.setItem(item, selectedValue)
        } catch (error) {
            console.log('AsyncStorage error:', error.message)
        }
    };

    async function getToken() {
        console.log('in getToken function');
        try {
            const token = await AsyncStorage.getItem("access_token")
            console.log(JSON.stringify(token))
        } catch (error) {
            console.log('AsyncStorage retrieval error:', error.message)
        }
    };

    loadThings = () => {
        fetch('http://192.168.1.52:5000/pics', {method: 'GET'})
            .then((response) => {
                return response.json()
            })
            .then((myJson) => {
                console.log(myJson)
            });
    }

    login = () => {
        console.log('in login function');
        // console.log(JSON.stringify({"username": "clarkKent","password": "superman"}))
        // console.log(JSON.stringify({"username": usernameInput, "password": passwordInput}))
        fetch('http://192.168.1.52:5000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": usernameInput,
                "password": passwordInput
            })
        })
            .then((response) => {
                return response.json()
            })
            .then((myJson) => {
                console.log('token:', myJson)
                deviceStorage("access_token", myJson.access_token)
                props.history.push('/camera');
            });
    }

    return (
        <>
        <Text>Vibecheque</Text>
        <TextInput
            onChangeText={(text) => setUsernameInput(text)}
            placeholder="username"    
        />
        <TextInput
            onChangeText={(text) => setPasswordInput(text)}
            placeholder="password"
        />
        <Text>Username: {usernameInput}</Text>
        <Text>Password: {passwordInput}</Text>
        <Button title="Login" onPress={login}></Button>
        <Text></Text>
        </>
    )
}

export default Login;