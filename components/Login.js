import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, ImageBackground, TouchableOpacity } from 'react-native';

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
        fetch('http://10.100.100.84:5000/login', {
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
        fetch('http://10.100.100.84:5000/register', {
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
            <ImageBackground
                        style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}
                        source={require('../assets/Vibecheque_6.png')}>
                
                <TextInput
                    style={{ marginTop: '95%', marginBottom: 2, fontSize: 26, borderWidth: 2, borderColor: 'black', backgroundColor: 'white', padding: 4, width: '50%'}}
                    onChangeText={(text) => setUsernameInput(text)}
                    placeholder="username"    
                />
                <TextInput
                    style={{ marginBottom: '2%', fontSize: 26, borderWidth: 2, borderColor: 'black', backgroundColor: 'white', padding: 4, width: '50%'}}
                    onChangeText={(text) => setPasswordInput(text)}
                    placeholder="password"
                />
                <TouchableOpacity
                    onPress={login}
                    style={{ 
                        width: '30%', 
                        borderWidth: 2,
                        borderColor: 'black',
                        borderRadius: 10,
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        marginBottom: 4}}>
                    <Text
                        style={{
                            fontSize: 26}}>
                        Login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={register}
                    style={{ 
                        width: '30%', 
                        borderWidth: 2,
                        borderColor: 'black',
                        borderRadius: 10,
                        backgroundColor: 'transparent',
                        alignItems: 'center'}}>
                    <Text
                        style={{
                            fontSize: 26}}>
                        Register
                    </Text>
                </TouchableOpacity>
            </ImageBackground>

        </>
    )
}

export default Login;