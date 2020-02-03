import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

const Camera = props => {

    toLogin = () => {
        props.history.push('/');
    }

    return (
        <>
        <Text>Camera page</Text>
        <Button title="Back to Login" onPress={toLogin}></Button>
        </>
    )
}

export default Camera;