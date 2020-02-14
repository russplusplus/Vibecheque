import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

import { connect } from 'react-redux';

class ViewInbox extends React.Component {

    goToCameraPage = () => {
        this.props.history.push('/camera')
    }

    componentDidMount() {
        console.log('reduxState.inbox:', this.props.reduxState.inbox)
    }
    
    render() {
        return (
            <>
                <Text>ViewInbox page</Text>
                <Button title="back" onPress={this.goToCameraPage}></Button>
            </>
        )
    }
}
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(ViewInbox);