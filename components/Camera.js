import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

const Camera = props => {

    toLogin = () => {
        props.history.push('/');
    }

    useEffect(() => {
        console.log('in useEffect');  //put a request to the pics route here to see if JWT verificaioin works
    });

    return (
        <>
        <Text>Camera page</Text>
        <Button title="Back to Login" onPress={toLogin}></Button>
        </>
    )
}

export default Camera;