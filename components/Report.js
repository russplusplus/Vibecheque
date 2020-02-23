import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';


class Report extends React.Component {

    state = {
        accessToken: ''
    }

    getToken = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token")
            console.log('getToken token:', token);
            return token;
        } catch (error) {
            console.log('AsyncStorage retrieval error:', error.message);
        }
        return '(missing token)';
    }

    report = () => {
        console.log('in report')
        fetch(`http://172.16.102.94:5000/users/${this.props.reduxState.inbox[0].from_users_id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            }  
        })
    }

    async componentDidMount() {
        console.log('in ViewInbox componentDidMount')
        await this.getToken()
            .then(response => {
                //console.log('in new .then. token:', response)
                this.setState({accessToken: response});
            }).catch(error => {
                console.log('in catch,', error)
            });
    }

    render() {
        return (
            <Modal visible={this.props.visible} animationType='slide' transparent={true}>
                <View style={{flex:1, alignItems: 'center', marginLeft:20, marginRight:20, marginTop:120, marginBottom:120, backgroundColor:'#FFFAAC', borderWidth:2, borderColor:'black'}}>
                        <Text style={{fontSize:48, textAlign:'center', marginTop:100}}>Bad Vibes?</Text>
                        <Text style={{fontSize:26, textAlign:'center', marginTop:50}}>The sender will be permanently banned.</Text>
                        <TouchableOpacity 
                            onPress={() => this.report()} 
                            style={{ 
                                width: '75%', 
                                borderWidth: 2,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: '#CC375E',
                                justifyContent: 'center',
                                marginTop: 50}}>
                            <Text
                                style={{
                                    fontSize: 26,
                                    textAlign: 'center'}}>
                                BAD VIBES
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.props.cancelReport()} 
                            style={{ 
                                width: '75%', 
                                borderWidth: 2,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: 'transparent',
                                justifyContent: 'center',
                                marginTop: 10}}>
                            <Text
                                style={{
                                    fontSize: 26,
                                    textAlign: 'center'}}>
                                Cancel
                            </Text>
                        </TouchableOpacity>                    
                </View>  
            </Modal>
        )
    }
}

export default Report