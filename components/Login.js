import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, ImageBackground, TouchableOpacity } from 'react-native';

const Login = props => {

    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [registerMode, setRegisterMode] = useState(false);

    async function deviceStorage(item, selectedValue) {
        console.log('in deviceStorage function');
        try {
            await AsyncStorage.setItem(item, selectedValue)
        } catch (error) {
            console.log('AsyncStorage error:', error.message)
        }
    };

    login = () => {
        console.log('in login function');
        fetch('http://172.16.102.94:5000/login', {
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
        fetch('http://172.16.102.94:5000/register', {
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
                    style={{ marginTop: '95%', marginBottom: 2, fontSize: 24, borderWidth: 2, borderColor: 'black', backgroundColor: 'white', padding: 4, width: '50%'}}
                    onChangeText={(text) => setUsernameInput(text)}
                    placeholder="username"    
                />
                <TextInput
                    style={{ marginBottom: '2%', fontSize: 24, borderWidth: 2, borderColor: 'black', backgroundColor: 'white', padding: 4, width: '50%'}}
                    onChangeText={(text) => setPasswordInput(text)}
                    placeholder="password"
                    secureTextEntry={true}
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
                        marginBottom: 6}}>
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