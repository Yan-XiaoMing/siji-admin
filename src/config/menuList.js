import {HomeOutlined, PushpinOutlined, CommentOutlined} from '@ant-design/icons';
import React from 'react';

const menuList = [
  {
    name: '主培项目',
    key: 'home',
    icon: <HomeOutlined/>
  },
  {
    name: '活动信息',
    key: 'activity',
    icon: <PushpinOutlined/>
  },
  {
    name: '教育咨询',
    key: 'advisory',
    icon: <CommentOutlined/>,
    children: [
      {
        name: '常见问题',
        key: 'question'
      },
      {
        name: '信息咨询',
        key: 'chat'
      },
      {
        name: '意见箱',
        key: 'opinion'
      }
    ]
  }
];

export default menuList;
