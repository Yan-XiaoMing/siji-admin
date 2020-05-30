import request from '../utils/request';
import {json} from './postHeaderConfig';

export function getChatList() {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/chat/list',
    method: 'GET'
  });
}

export function getAllUser() {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/user/getAll',
    method: 'GET'
  });
}
