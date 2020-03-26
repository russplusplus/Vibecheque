import { combineReducers } from 'redux';

import inboxReducer from './inboxReducer';
import respondingReducer from './respondingReducer';
import capturedImageReducer from './capturedImageReducer';

const rootReducer = combineReducers({
    inbox: inboxReducer,
    responding: respondingReducer,
    capturedImage: capturedImageReducer
})

export default rootReducer;