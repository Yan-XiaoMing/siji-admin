import store from 'store';

const USER_KEY = 'user';

export default {

  saveUser(user) {
    store.set(USER_KEY, user);
  },

  getUser() {
    // return JSON.parse(localStorage.getItem(USER_KEY)||'{}');
    return store.get(USER_KEY) || {};
  },

  removeUser() {
    // localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY);
  },

  getItem(item) {
    return store.get(item) || {};
  },

  setItem(name, value) {
    store.set(name, value);
  }

};
