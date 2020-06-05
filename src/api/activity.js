import request from '../utils/request';
import {json} from './postHeaderConfig';

export function getActivityList() {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/activity/backGetAll',
    method: 'GET'
  });
}

export function removeActivity(data) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/activity/remove',
    method: 'POST',
    data
  });
}

export function addActivity(data) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/activity/create',
    method: 'POST',
    data
  });
}

export function updateActivity(data) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/activity/modify',
    method: 'POST',
    data
  });
}

export function getApplyList(id) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/activity/getApplyList/' + id,
    method: 'GET'
  });
}

export function addApply(data) {
  return request({
    headers: {
      'Content-Type': json
    },
    url: '/activity/apply',
    method: 'POST',
    data
  });
}
