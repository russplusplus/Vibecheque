const capturedImageReducer = (state = {}, action) => {
    if (action.type === 'SET_CAPTURED_IMAGE') {
        return action.payload;
    } else {
        return state;
    }
}

export default capturedImageReducer;