const inboxReducer = (state = [], action) => {
    if (action.type === 'SET_INBOX') {
        return action.payload;
    } else {
        return state;
    }
}

export default inboxReducer;