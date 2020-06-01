import request from '../utils/request';
import {json} from './postHeaderConfig';

export function getTermList() {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/term/getAll',
    method: 'GET'
  });
}

export function removeTerm(termName) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/term/remove/' + termName,
    method: 'GET'
  });
}

export function addTerm(data) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/term/create',
    method: 'POST',
    data
  });
}

export function updateTerm(data) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/term/modify',
    method: 'POST',
    data
  });
}
