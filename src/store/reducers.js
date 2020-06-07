import {combineReducers} from 'redux';
import {SET_WEBSOCKET, SET_ONLINELIST, SET_CHATLIST, ADD_CHAT} from './constants';
import {reducer as userReducer} from '../pages/login/store';

function websocket(state = null, action) {
  switch (action.type) {
    case SET_WEBSOCKET: {
      return action.websocket;
    }
    default:
      return state;
  }
}

function onlineList(state = [], action) {
  switch (action.type) {
    case SET_ONLINELIST: {
      return action.onlineList;
    }
    default:
      return state;
  }
}

function chatList(state = [], action) {
  switch (action.type) {
    case SET_CHATLIST: {
      return action.chatList;
    }
    case ADD_CHAT: {
      return [...state, action.chat];
    }
    default:
      return state;
  }
}

export default combineReducers({
  user: userReducer,
  onlineList,
  websocket,
  chatList
});

