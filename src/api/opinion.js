import request from '../utils/request';
import {json} from './postHeaderConfig';

export function getOpinion() {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/opinion/getAll',
    method: 'GET'
  });
}

export function removeOpinion(id) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/opinion/remove/' + id,
    method: 'GET'
  });
}
