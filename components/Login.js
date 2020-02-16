import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage } from 'react-native';

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

    login = () => {
        console.log('in login function');
        // console.log(JSON.stringify({"username": "clarkKent","password": "superman"}))
        // console.log(JSON.stringify({"username": usernameInput, "password": passwordInput}))
        fetch('http://192.168.5.67:5000/login', {
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
            }).catch((error) => {
                console.log('in catch, error:', error)
            });
    }

    register = () => {
        console.log('in register function');
        fetch('http://192.168.5.67:5000/register', {
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
        <Button title="Register" onPress={register}></Button>
        <Text></Text>
        </>
    )
}

export default Login;