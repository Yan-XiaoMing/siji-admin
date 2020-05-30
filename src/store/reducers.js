import {combineReducers} from 'redux';

import {reducer as userReducer} from '../pages/login/store';

export default combineReducers({
  user: userReducer
});

