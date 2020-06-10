import {SET_WEBSOCKET, SET_ONLINELIST, ADD_CHAT, SET_CHATLIST} from './constants';
import {notification, Avatar} from 'antd';
import {getChatList} from '../api/chat';
import {replaceImg} from '../utils/util';
import React from 'react';

export function setWebsocket(websocket) {
  return {
    type: SET_WEBSOCKET,
    websocket
  };
}

export function initWebSocket(user) {    //初始化websocket对象
  // console.log(window.location.hostname);
  return async function (dispatch) {
    const websocket = new WebSocket('ws://' + '47.96.167.250' + ':7778');
    //建立连接时触发
    websocket.onopen = function (event) {
      const data = {
        id: user.id,
        username: user.username
      };
      //当用户第一次建立websocket链接时，发送用户信息到后台，告诉它是谁建立的链接
      websocket.send(JSON.stringify(data));
      // console.log(event);
    };
    //监听服务端的消息事件
    websocket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log(data);
      //在线人数变化的消息
      if (data.type === 0) {
        dispatch(setOnlinelist(data.msg.onlineList));
        console.log(data.msg.text);
        if (data.msg.text && data.msg.text != '' && data.msg.text !== '用户undefined已上线') {
          notification.info({
            message: '提示',
            description: data.msg.text
          });
        }
      }
      //聊天的消息
      if (data.type === 1) {
        dispatch(addChat(data.msg));
        notification.open({
          message: data.msg.username,
          description: <div style={{wordBreak: 'break-all'}}
                            dangerouslySetInnerHTML={{__html: replaceImg(data.msg.content)}}/>
        });
      }
      // console.log(11, data);
    };
    websocket.onerror = (err) => {
      console.log(err);
    };
    dispatch(setWebsocket(websocket));
    dispatch(initChatList());
  };
}

export function setOnlinelist(onlineList) {
  return {
    type: SET_ONLINELIST,
    onlineList
  };
}

export function initChatList() {
  return async function (dispatch) {
    const res = await getChatList();
    const data = res.data;
    dispatch(setChatList(data.data || []));
  };
}

export function setChatList(chatList) {
  return {
    type: SET_CHATLIST,
    chatList
  };
}

export function addChat(chat) {
  return {
    type: ADD_CHAT,
    chat
  };
}
