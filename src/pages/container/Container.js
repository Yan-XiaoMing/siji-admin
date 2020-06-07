import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Layout, Modal, message} from 'antd';
import MyContent from './MyContent';
import MyHeader from './MyHeader';
import MySider from './MySider';
import {initWebSocket} from '../../store/actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {checkToken} from '../../api/login';
import storageUtils from '../../utils/storageUtils';
import GithubOutlined from '@ant-design/icons/lib/icons/GithubOutlined';
import './style.less';


const {Header, Sider, Content, Footer} = Layout;

const store = connect(
  (state) => ({user: state.user, websocket: state.websocket}),
  (dispatch) => bindActionCreators({initWebSocket}, dispatch)
);

@store
class Container extends Component {

  state = {
    collapsed: false,  //侧边栏的折叠和展开
    panes: [],    //网站打开的标签页列表
    activeMenu: ''  //网站活动的菜单
  };

  init = async () => {
    const user = storageUtils.getUser();
    this.props.initWebSocket(user);
  };

  _setState = (obj) => {
    this.setState(obj);
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  logout = () => {
    Modal.confirm({
      title: '确认要退出登录吗？',
      onOk: () => {
        // console.log('ok');
        storageUtils.removeUser();
        this.props.history.replace('/login');
      }
    });
  };


  async componentDidMount() {
    const user = storageUtils.getUser();
    this.init();
    if (!user.token) {
      message.warning('您的登录已过期');
      storageUtils.removeUser();
      this.props.history.replace('/login');
    } else {
      const result = await checkToken();
      const data = result.data;
      if (data.code !== 0) {
        message.warning('您的登录已过期');
        storageUtils.removeUser();
        this.props.history.replace('/login');
      }
    }
  }

  render() {
    const {collapsed, panes, activeMenu} = this.state;
    return (
      <Layout style={{height: '100vh'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <MySider
            panes={panes}
            activeMenu={activeMenu}
            onChangeState={this._setState}/>
        </Sider>
        <Layout>
          <Header style={{padding: 0}}>
            <MyHeader
              logout={this.logout}
              collapsed={collapsed}
              onChangeState={this._setState}/>
          </Header>
          <Content>
            <MyContent
              panes={panes}
              activeMenu={activeMenu}
              onChangeState={this._setState}/>
          </Content>
          <Footer style={{textAlign: 'center', background: '#fff'}}>
            SiJi-Admin ©{new Date().getFullYear()} Created by <a
            href='https://github.com/PaperGangsta'> Ali_Ming <GithubOutlined/></a>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Container);
