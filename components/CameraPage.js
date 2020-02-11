import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Platform, TouchableOpacity, ImageBackground } from 'react-native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { render } from 'react-dom';

const IPAddress = '192.168.1.52';

export default class CameraPage extends React.Component {

    state = {
        accessToken: '',
        cameraPermission: null,
        cameraType: Camera.Constants.Type.back,
        photo: {},
        review: false
    }

    // const [accessToken, setAccessToken] = useState('');
    // const [cameraPermission, setCameraPermission] = useState(null);
    // const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    // const [photo, setPhoto] = useState({});
    // const [review, setReview] = useState(false);

    toFavorite = () => {
        this.props.history.push('/favorite');
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

    handleCameraType = () => {
        console.log('in handleCameraType')
        const cameraType = this.state.cameraType;
        console.log('before:', cameraType)
        this.setState({cameraType:
            cameraType === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        }) 
        console.log('after:', cameraType)
    }

    getPermissionAsync = async () => {
        // Camera roll Permission 
        if (Platform.OS === 'ios') {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
        // Camera Permission
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ cameraPermission: status === 'granted' });
    }

    takePicture = async () => {
        console.log('in takePicture')
        if (this.camera) {
            this.camera.takePictureAsync({
                quality: 0.1,
                base64: true,
                exif: false
            }).then(photo => {
                console.log('in takePicture .then')
                this.setState({ photo: photo, review: true })
            })
        }
    }

    cancel = () => {
        console.log('in cancel')
        this.setState({review: false})
    }

    sendImage = () => {
        console.log('in sendImage')
    }

    viewInbox = () => {
        console.log('in viewInbox');
    }

    viewFavorite = () => {
        console.log('in viewFavorite');
        this.props.history.push('/favorite');
    }

    async componentDidMount() {
        this.getPermissionAsync();
        // GET request any incoming photos. Randomly generate "to user" column in pictures table and query by this column,
        this.getToken()
            .then(response => {
                console.log('in new .then. token:', response)
                this.setState({accessToken: response});
            }).catch(error => {
                console.log('in catch,', error)
            });
        console.log('in componenetDidMount');
      //  console.log(`getToken():`, getToken())  //put a request to the pics route here to see if JWT verificaioin works
        console.log(this.state.accessToken);
        
    };

    render() {
        const { hasPermission } = this.state;

        if (hasPermission === null) {
            return <View />;
        } else if (hasPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1, margin: 0 }}>
                    {this.state.review ? (
                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: this.state.photo.uri }}>
                        <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}
                                onPress={() => this.cancel()}>
                                <Ionicons
                                    name="md-close"
                                    style={{ color: "#fff", fontSize: 40}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                }}
                                onPress={() => this.sendImage()}>
                                <Ionicons
                                    name="md-send"
                                    style={{ color: "#fff", fontSize: 40}}
                                />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                    ) : (
                    <Camera style={{ flex:1 }} type={this.state.cameraType} ref={ref => {this.camera = ref;}}>
                        <View style={{flex:1,flexDirection:"column",justifyContent:"space-between",margin:20}}>
                            <View>
                                <TouchableOpacity
                                    style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                    }}
                                    onPress={() => this.handleCameraType()}>
                                    <Ionicons
                                        name="ios-reverse-camera"
                                        style={{ color: "#fff", fontSize: 40}}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1,flexDirection:"row",justifyContent:"space-between"}}>
                                <TouchableOpacity
                                    style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',                  
                                    }}
                                    onPress={() => this.viewInbox()}>
                                    <Text style={{fontSize:30, color:"white"}}>
                                        1
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                    }}
                                    onPress={() => this.takePicture()}>
                                    <FontAwesome
                                        name="camera"
                                        style={{ color: "#fff", fontSize: 40}}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                    }}
                                    onPress={() => this.viewFavorite()}>
                                    <Ionicons
                                        name="md-star"
                                        style={{ color: "#fff", fontSize: 40}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                            
                    </Camera>
                    )}
                </View>
            );
        }
    }
    
}