const respondingReducer = (state = {}, action) => {
    if (action.type === 'SET_RESPONDING') {
        return action.payload;
    } else if (action.type === 'SET_NOT_RESPONDING') {
        return null;
    } else {
        return state;
    }
}

export default inboxReducer;