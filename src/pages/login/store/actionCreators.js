import * as constants from './constants';

export const saveUserData = (user) => ({
  type: constants.SAVE_USER_DATA,
  user
});
