import request from '../utils/request';

export function checkToken() {
  return request({
    url: '/checkToken' + localStorage.getItem('token'),
    method: 'GET'
  });
}

export function reqDeleteImg(filename) {
  return request({
    url: '/img/remove/' + filename,
    method: 'GET'
  });
}

