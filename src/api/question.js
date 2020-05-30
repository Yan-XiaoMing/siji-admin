import request from '../utils/request';
import {json} from './postHeaderConfig';

export function getQuestion() {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/question/getAll',
    method: 'GET'
  });
}

export function addQuestion(data) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/question/add',
    method: 'POST',
    data
  });
}

export function updateQuestion(data) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/question/modify',
    method: 'POST',
    data
  });
}

export function removeQuestion(id) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/question/remove/' + id,
    method: 'GET'
  });
}
