import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Platform, TouchableOpacity, ImageBackground } from 'react-native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { render } from 'react-dom';

import { connect } from 'react-redux';


class CameraPage extends React.Component {

    state = {
        accessToken: '',
        cameraPermission: null,
        cameraType: Camera.Constants.Type.back,
        image: {},
        review: false,
        inbox: 0,
        S3Key: ''
    }

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
            }).then(image => {
                console.log('in takePicture .then')
                this.setState({ image: image, review: true })
            })
        }
    }

    cancel = () => {
        console.log('in cancel')
        this.setState({review: false})
    }

    sendImage = async () => {
        console.log('in sendImage')
        
        // Get the time in milliseconds to use for the file names in S3
        let d = new Date();
        let fileName = String(d.getTime());
        console.log('Time name:', fileName);
        await this.setS3Key(fileName) //await ensures that the state will be set before the following line is run
        console.log('State key:', this.state.S3Key); 
        this.getPutUrl();
    }

    setS3Key = (name) => {
        this.setState({ S3Key: name })
    }


    getPutUrl = () => {
        const Key = this.state.S3Key;
        const ContentType = 'image/jpeg'; 
        fetch(`http://192.168.5.67:5000/aws/generate-put-url?Key=${Key}&ContentType=${ContentType}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',  //this limits fetch to being able to read JSON response objects
            }
        }).then((response) => {
            return response.json()
        }).then((myJson) => {
            console.log('put url:', myJson.putURL)  //server returns URL as object with putURL attribute
            this.putImageToS3(myJson.putURL);
        }).catch((error) => {
            console.log('error in generate-put-url:', error)
        })
    }

    putImageToS3 = (putURL) => {
        console.log('in putImageToS3, url:', putURL)
        fetch(putURL, {
            method: 'PUT',
            // headers: {
            //     Accept: 'application/json',
            //     'Content-Type': 'text/plain'
            // },
            // body: JSON.stringify({
            //     "image": this.state.image.base64
            // })
            body: this.state.image
        }).then((response) => {
            console.log('in putImageToS3 first .then')
            return response.text()
        }).then((myJson) => {
            console.log('in putImageToS3 second .then')
            console.log(myJson);
            this.getGetUrl();
        }).catch((error) => {
            console.log('error in putImageToS3:', error);
        })
    }

    getGetUrl = () => {
        console.log('in getGETURL. S3Key:', this.state.S3Key);
        const Key = this.state.S3Key;
        fetch(`http://192.168.5.67:5000/aws/generate-get-url?Key=${Key}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',  //this limits fetch to being able to read JSON response objects
            }
        }).then((response) => {
            return response.json()
        }).then((myJson) => {
            console.log('get url:', myJson.getURL)  //server returns URL as object with putURL attribute
            this.sendGetUrlToDatabase(myJson.getURL)
        }).catch((error) => {
            console.log('error in generate-put-url:', error)
        })
    }

    sendGetUrlToDatabase = (URL) => {
        console.log('in sendGetUrlToDatabase')
        fetch('http://192.168.5.67:5000/images', {
            method: 'POST',
            body: JSON.stringify({url: URL}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            }
        })
    }

    viewInbox = () => {
        console.log('in viewInbox');
        this.props.history.push('/viewInbox');
    }

    viewFavorite = () => {
        console.log('in viewFavorite');
        this.props.history.push('/favorite');
    }

    getInbox = () => {
        console.log('in getInbox')
        fetch('http://192.168.5.67:5000/images', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            }
        }).then((response) => {
            return response.json()
        }).then((myJson) => {
            console.log('inbox images:', myJson)
            const inbox = myJson.length
            console.log('inbox:', inbox)
            //this.setState({inbox: inbox})
            //dispatch inbox to reduxState
            this.props.dispatch({type: 'SET_INBOX', payload: myJson})
        }).catch((error) => {
            console.log('error in getInbox:', error)
        });
    }

    async componentDidMount() {
        this.getPermissionAsync();
        // GET request any incoming photos. Randomly generate "to user" column in pictures table and query by this column,
        await this.getToken()
            .then(response => {
                console.log('in new .then. token:', response)
                this.setState({accessToken: response});
            }).catch(error => {
                console.log('in catch,', error)
            });
        this.getInbox();
        console.log('retrieving reduxState:', this.props.reduxState.inbox)
        
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
                    source={{ uri: this.state.image.uri }}>
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

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(CameraPage);