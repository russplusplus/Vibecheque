import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage } from 'react-native';

const Favorite = props => {

    const [accessToken, setAccessToken] = useState('');

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

    loadPic = () => {
        fetch('http://10.100.100.137:5000/users', {
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

                console.log('users:', myJson)
            });
    }

    useEffect(() => {
        // GET request any incoming photos. Randomly generate "to user" column in pictures table and query by this column,
        console.log('in useEffect');
        getToken()
            .then(response => {
                console.log('in new .then. token:', response)
                //setAccessToken(response);
                setAccessToken('nonsense');
            }).catch(error => {
                console.log('in catch,', error)
            });
    });

    return (
        <>
        <Text>Favorite page</Text>
        <Button title="Load" onPress={loadPic}></Button>
        </>
    )
}

export default Favorite;