import request from '../utils/request';
import {json} from './postHeaderConfig';

export function login(data) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/user/login',
    method: 'POST',
    data: data
  });
}

export function checkToken() {
  return request({
    method: 'GET',
    url: '/user/checkToken'
  });
}

