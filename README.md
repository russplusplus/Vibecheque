# Vibecheque

At Prime Academy, we were assigned a solo project, which entailed individually building an application over the course of two weeks. For mine, I built this mobile app. The premise of the app is that social media confines us to bubbles, limiting us to interacting with the same people again and again. This app transcends these bubbles by facilitating brief exchanges of fresh perspective, or vibe checks, between strangers.

## Description

The application allows the user to take a photo that will be sent to a randomly-selected user. The recipient will have an opportunity to respond once with an image of their own, and there is no further connection between the two. Usernames are never displayed, making the interaction relatively anonymous. Users can keep one received image saved at a time for viewing after the initial exchange. A user can also report a recieved image, which will ban the sender permanently. 

## Technologies Used

The app is built in React Native with Redux and Expo, interacts with an Express server written in Node.js, and stores data in a PostgreSQL database. The images are stored in AWS S3, and the URLs to access them are stored in the PostgreSQL database. Authentication and sessions are handled with Javascript Web Tokens.
