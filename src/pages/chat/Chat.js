import React, {Component} from 'react';
import {replaceImg, throttle} from '../../utils/util';
import BraftEditor from 'braft-editor';
import moment from 'moment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {initWebSocket, initChatList} from '../../store/actions';
import {message, Avatar, Divider} from 'antd';
import {List, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import storageUtils from '../../utils/storageUtils';
import './style.less';
import 'braft-editor/dist/index.css';


const cache = new CellMeasurerCache({
  defaultHeight: 96,
  fixedWidth: true
});

const user = storageUtils.getUser();

const store = connect(
  (state) => ({websocket: state.websocket, chatList: state.chatList}),
  (dispatch) => bindActionCreators({initWebSocket, initChatList}, dispatch)
);

@store
class Chat extends Component {


  state = {
    editorState: BraftEditor.createEditorState(null),
    userList: [], //所有用户列表,
    user: user
  };

  scrollToRow = () => {
    // 页面首次进入时并没有滚动到最底部，用下面这种方法进行处理
    const rowIndex = this.props.chatList.length - 1;
    this.chatListDom.scrollToRow(rowIndex);
    clearTimeout(this.scrollToRowTimer);
    this.scrollToRowTimer = setTimeout(() => {
      if (this.chatListDom) {
        this.chatListDom.scrollToRow(rowIndex);
      }
    }, 10);
  };
  handleEditorChange = (editorState) => {
    this.setState({editorState});
  };
  //定制键盘命令
  handleKeyCommand = (command) => {
    //如果是回车命名就发送信息
    if (command === 'split-block') {
      this.onSend();
      return 'handled';
    }
    return 'not-handled';
  };

  onSend = () => {
    const editorState = this.state.editorState;
    const htmlContent = editorState.toHTML();
    const websocket = this.props.websocket;
    if (editorState.isEmpty()) {
      return message.warning('请先输入聊天内容');
    }
    if (websocket.readyState !== 1) {
      //断开连接，重新连接
      this.props.initWebSocket(user);
      return message.warning('消息发送失败，请重新发送');
    }
    websocket.send(JSON.stringify({
      content: htmlContent
    }));
    this.setState({
      editorState: BraftEditor.createEditorState(null)
    });
  };

  //时间上的处理
  handleTime = (time, small) => {
    if (!time) {
      return '';
    }
    const HHmm = moment(time).format('HH:mm');
    //不在同一年，就算时间差一秒都要显示完整时间
    if (moment().format('YYYY') !== moment(time).format('YYYY')) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
    //判断时间是否在同一天
    if (moment().format('YYYY-MM-DD') === moment(time).format('YYYY-MM-DD')) {
      return HHmm;
    }
    //判断时间是否是昨天。不在同一天又相差不超过24小时就是昨天
    if (moment().diff(time, 'days') === 0) {
      return `昨天 ${HHmm}`;
    }
    //判断时间是否相隔一周
    if (moment().diff(time, 'days') < 7) {
      const weeks = ['一', '二', '三', '四', '五', '六', '日'];
      return `星期${weeks[moment(time).weekday()]} ${HHmm}`;
    }
    if (small) {
      return moment(time).format('MM-DD HH:mm');
    } else {
      return moment(time).format('M月D日 HH:mm');
    }
  };

  onMouseDown = (e) => {
    e.persist();
    e.preventDefault();
    this.isDown = true;
    this.chatHeader.style.cursor = 'move';
    //保存初始位置
    this.mouse = {
      startX: e.clientX,
      startY: e.clientY,
      offsetLeft: this.chatBox.offsetLeft,
      offsetTop: this.chatBox.offsetTop
    };
  };
  //节流函数优化
  onMouseMove = throttle((e) => {
    if (!this.isDown) {
      return;
    }
    //计算偏移位置
    let offsetLeft = this.mouse.offsetLeft + e.clientX - this.mouse.startX;
    let offsetTop = this.mouse.offsetTop + e.clientY - this.mouse.startY;

    //设置偏移距离的范围[0,this.chatContainer.clientWidth - 780]
    offsetLeft = Math.max(0, Math.min(offsetLeft, this.chatContainer.clientWidth - 780));
    offsetTop = Math.max(0, Math.min(offsetTop, window.innerHeight - 624));

    this.chatBox.style.left = offsetLeft + 'px';
    this.chatBox.style.top = offsetTop + 'px';
  }, 10);
  onMouseUp = () => {
    this.isDown = false;
    this.chatHeader.style.cursor = 'default';
    this.mouse = null;
  };

  componentDidMount() {
    if (this.props.websocket && this.props.websocket.readyState !== 1) {
      this.props.initWebSocket(user);
    }
    // this.scrollToRow()
    // this.getUserList()
    window.onmouseup = this.onMouseUp;
  }

  componentDidUpdate(prevProps) {
    if (this.props.chatList !== prevProps.chatList) {
      this.scrollToRow();
    }

  }

  componentWillUnmount() {
    window.onmouseup = null;
  }


  render() {
    const {editorState, userList, user} = this.state;
    const {chatList} = this.props;
    // let chatList=[];
    let onlineList = [];
    const controls = ['emoji', 'italic', 'text-color', 'separator', 'link', 'separator', 'media'];
    // 禁止上传video、audio
    const media = {
      accepts: {
        image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
        video: false,
        audio: false
      },
      externals: {
        image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
        video: false,
        audio: false,
        embed: false
      }
    };
    const hooks = {
      'toggle-link': ({href, target}) => {
        const pattern = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-.,@?^=%&:/~+#]*)+)?$/;
        if (pattern.test(href)) {
          return {href, target};
        }
        message.warning('请输入正确的网址');
        return false;
      }
    };
    const lastChat = chatList[chatList.length - 1] || {};
    return (
      <div className='chat-container' ref={el => this.chatContainer = el}>
        <div className='chat-box' ref={el => this.chatBox = el}>
          <div className='chat-header' onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove}
               ref={el => this.chatHeader = el}>
            <div className='header-left'>
              <img src={require('./imgs/header1.png')} alt=""/>
            </div>
            <div className='header-center'>
              <img src={require('./imgs/header2.png')} alt=""/>
            </div>
            <div className='header-right'>
              <Avatar src={require('./imgs/boy.png')}/>
            </div>
          </div>
          <div className='chat-body'>
            <div className='left'>
              <div className='left-item'>
                <div><Avatar size='large' src={require('../../asset/img/logo_wuzi.png')}/></div>
                <div className='left-item-text'>
                  <div className='group-name'>
                    <span>四季聊天室</span>
                    <span>{this.handleTime(lastChat.createTime, true).split(' ')[0]}</span>
                  </div>
                  <div className='group-message' style={{display: lastChat.userId ? 'flex' : 'none'}}>
                    <div style={{flexFlow: 1, flexShrink: 0}}>{lastChat.username}:&nbsp;</div>
                    <div className='ellipsis' dangerouslySetInnerHTML={{__html: replaceImg(lastChat.content)}}/>
                  </div>
                </div>
              </div>
            </div>
            <div className='main'>
              <List
                ref={el => this.chatListDom = el}
                width={443}
                height={328}
                style={{outline: 'none'}}
                rowCount={chatList.length}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
                rowRenderer={({index, isScrolling, key, parent, style}) => (
                  <CellMeasurer
                    cache={cache}
                    columnIndex={0}
                    key={key}
                    parent={parent}
                    rowIndex={index}
                  >
                    <div style={style} className='chat-item'>
                      {/* 两条消息记录间隔超过3分钟就显示时间 */}
                      {(index === 0 || chatList[index].createTime - chatList[index - 1].createTime > 3 * 60 * 1000) && (
                        <div className='time'>{this.handleTime(chatList[index].createTime)}</div>
                      )}
                      <div className={`chat-item-info ${user.id === chatList[index].userId ? 'chat-right' : ''}`}>
                        <div><Avatar src={require('./imgs/boy.png')}/></div>
                        <div className='chat-main'>
                          <div className='username'>{chatList[index].username}</div>
                          <div className='chat-content' dangerouslySetInnerHTML={{__html: chatList[index].content}}/>
                        </div>
                      </div>

                    </div>
                  </CellMeasurer>
                )}
              />
              <div className='chat-editor-wrapper'>
                <BraftEditor
                  draftProps={{
                    handleKeyCommand: this.handleKeyCommand
                  }}
                  media={media}
                  hooks={hooks}
                  value={editorState}
                  onChange={this.handleEditorChange}
                  contentStyle={styles.contentStyle}
                  controlBarStyle={styles.controlBarStyle}
                  controls={controls}
                />
              </div>
            </div>
            <div className='right'>
              <div style={{height: 162}}>
                <div style={{padding: 5}}>群公告</div>
                <div style={styles.center}>
                  <img src={require('./imgs/zanwu.png')} alt="" style={{width: '80%'}}/>
                </div>
                <Divider style={{margin: '10px 0 0'}}/>
                <div className='member'>成员 {onlineList.length}/{userList.length}</div>
              </div>
              <List
                width={134}
                height={296}
                style={{outline: 'none'}}
                rowCount={userList.length}
                rowHeight={35}
                rowRenderer={({key, index, style}) => (
                  <div key={key} className='user-item' style={style}>
                    <div className={`avatar-box ${userList[index].online ? '' : 'mask'}`}>
                      <img style={{width: '100%', height: '100%'}} src={userList[index].avatar} alt=""/>
                      <div/>
                    </div>
                    <div className='ellipsis'
                         style={{flexGrow: 1, margin: '0 3px 0 5px'}}>{userList[index].username}</div>
                    <div style={{display: userList[index].isAdmin ? 'block' : 'none'}}><img width={18} height={20}
                                                                                            src={require('./imgs/administrator.png')}
                                                                                            alt=""/></div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

}


const styles = {
  contentStyle: {
    height: 100,
    paddingBottom: 0,
    transform: 'translateY(-15px)',
    fontSize: 14
  },
  controlBarStyle: {
    boxShadow: 'none'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};


export default Chat;
