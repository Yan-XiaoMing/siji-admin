import * as constants from './constants';

const defaultState = {
  user: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.SAVE_USER_DATA:
      // console.log(action);
      return action.user;
    default:
      return state;
  }
}
