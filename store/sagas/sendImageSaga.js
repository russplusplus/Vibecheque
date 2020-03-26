import { put, select, takeEvery } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';

function* sendImage(action) {
    console.log('in send image saga')

    // Get the time in milliseconds to use for the file names in S3
    let d = new Date();
    const Key = String(d.getTime());
    const ContentType = 'image/jpeg';

    // Get JWT from Async Storage
    let jwt = yield AsyncStorage.getItem("access_token")

    // Get reduxState
    const reduxState = yield select();

    // GET PUT URL
    fetch(`https://murmuring-lake-71708.herokuapp.com/aws/generate-put-url?Key=${Key}&ContentType=${ContentType}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwt
            }
    }).then((response) => {
        return response.json()
    }).then((myJson) => {
        console.log('put url:', myJson.putURL)  //server returns URL as object with putURL attribute
        putURL = myJson.putURL

        // PUT image to S3
        fetch(putURL, {
            method: 'PUT',
            body: reduxState.capturedImage //tell this to look in redux instead
        }).then((response) => {
            console.log('in putImageToS3 first .then')
            return response.text()
        }).then((myJson) => {
            console.log('in putImageToS3 second .then')
            //console.log(myJson);
            // GET GET URL
            console.log('Key:', Key)
            fetch(`https://murmuring-lake-71708.herokuapp.com/aws/generate-get-url?Key=${Key}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwt
            }
            }).then((response) => {
                return response.json()
            }).then((myJson) => {
                console.log('get url:', myJson.getURL)  //server returns URL as object with putURL attribute
                const getURL = myJson.getURL
                fetch('https://vibecheque-543ff.firebaseio.com/images.json', {
                    method: 'POST',
                    body: JSON.stringify({url: getURL}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    console.log('in Firebase .then')
                    return response.json()
                }).then((myJson) => {
                    console.log('in second Firebase .then. myJson:', myJson)
                })
            }).catch((error) => {
                console.log('error in generate-put-url:', error)
            })
        }).catch((error) => {
            console.log('error in putImageToS3:', error);
        })
    }).catch((error) => {
        console.log('error in generate-put-url:', error)
    })

}

function* sendImageSaga() {
    yield takeEvery('SEND_IMAGE', sendImage)
    
}

// const mapReduxStateToProps = reduxState => ({
//     reduxState
// });

export default sendImageSaga;