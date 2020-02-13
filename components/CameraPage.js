import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Platform, TouchableOpacity, ImageBackground } from 'react-native';

import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { render } from 'react-dom';

export default class CameraPage extends React.Component {

    state = {
        accessToken: '',
        cameraPermission: null,
        cameraType: Camera.Constants.Type.back,
        image: {},
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

    sendImage = () => {
        console.log('in sendImage')
        //console.log(JSON.stringify(this.state.image))
       
        // fetch('http://10.100.100.137:5000/images', {   // request entity too large
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         "photo": this.state.photo
        //     })
        // })

            // GET SIGNED URL FROM SERVER
            // USER SIGNED URL TO UPDOOT TO S3


        // const bucketName = 'vibecheque';
        // const keyName = 'testKey';
        
        // aws.config.loadFromPath('../aws_config/config.json');
        // aws.config.getCredentials(function(err) {
        //     if (err) console.log(err.stack);
        //     // credentials not loaded
        //     else {
        //       console.log("Access key:", aws.config.credentials.accessKeyId);
        //       console.log("Secret access key:", aws.config.credentials.secretAccessKey);
        //     }
        //   });
        // // Create a promise on S3 service object
        // const bucketPromise = new aws.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise();
        // bucketPromise.then(
        //     function(data) {
        //         const objectParams = {Bucket: bucketName, Key: keyName, Body: 'Hello Worlds!'};
        //         const uploadPromise = new aws.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
        //         uploadPromise.then(
        //             function(data) {
        //                 console.log('Successfully upladed data to ' + bucketName + '/' + keyName)
        //             }
        //         );
        //     }
        // ).catch((err) => {
        //     console.error(err, err.stack);
        // });



        // const s3 = new aws.s3({
        //     region: 'US EAST',
        //     credentials: config
        // })

//         const Key = 'newImage';
//         //const ContentType = 'image/jpeg';
//         fetch(`http://10.100.100.137:5000/aws/generate-get-url?Key=${Key}`, {
//             method: 'GET',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             }
//         }).then((response) => {
// //console.log('response:', response.json())
//             return response.json()
//         }).then((myJson) => {

//             console.log('get url:', myJson.getURL)
//         }).catch((error) => {
//             console.log('error in generate-get-url:', error)
//        })

        this.getPutUrl();
        
    }

    getPutUrl = () => {
        const Key = 'newImage.jpg';
        const ContentType = 'image/jpeg';  //try image/jpeg once this works
        fetch(`http://10.100.100.137:5000/aws/generate-put-url?Key=${Key}&ContentType=${ContentType}`, {
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
        console.log('in getGETURL');
        const Key = 'newImage.jpg';
        fetch(`http://10.100.100.137:5000/aws/generate-get-url?Key=${Key}`, {
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
        fetch('http://10.100.100.137:5000/pics', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "url": URL
            })
        })
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