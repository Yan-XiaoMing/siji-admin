import React, {Component} from 'react';
import {message, Menu, Avatar} from 'antd';
import screenfull from 'screenfull';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  AntDesignOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons';
import ColorPicker from '../../components/ColorPicker/index';
import storageUtils from '../../utils/storageUtils';
import EditInfoModal from './EditInfoModal';
import EditPasswordModal from './EditPasswordModal';
import './style.less';
import {formatFieldsData} from '../../utils/util';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


class MyHeader extends Component {

  constructor(props) {
    super(props);
    const userTheme = storageUtils.getItem('user-theme');
    const user = storageUtils.getUser();
    // console.log(userTheme);
    let color = '#1890ff';
    if (userTheme) {
      window.less.modifyVars(userTheme);
      color = userTheme['@primary-color'];
    }
    this.state = {
      user: user,
      isFullscreen: false,    //控制页面全屏
      color: color,
      infoVisible: false,     //控制修改用户信息的模态框
      passwordVisible: false   //控制修改密码的模态框
    };
  }

  toggleCollapsed = () => {
    this.props.onChangeState({
      collapsed: !this.props.collapsed
    });
  };

  toggleFullScreen = () => {
    if (screenfull.enabled) {
      screenfull.toggle().then(() => {
        this.setState({
          isFullscreen: screenfull.isFullscreen
        });
      });
    }
  };

  openEditInfoModal = () => {
    this.EditInfoModal.toggleVisible(true);
  };

  openEditPasswordModal = () => {
    console.log(111);
    this.EditPasswordModal.toggleVisible(true);
  };

  /**
   * 退出登录
   */
  onLogout = () => {
    this.props.logout();   //清空localStore 中的数据
  };

  changeColor = (color) => {
    window.less.modifyVars({
      '@primary-color': `${color}`
    }).then(() => {
      storageUtils.setItem('user-theme', {'@primary-color': color});
    });
    this.setState({
      color
    });
    message.success('主题色修改成功');
  };

  resetColor = () => {
    this.changeColor('#1890ff');
  };

  render() {
    const {isFullscreen, color, user} = this.state;

    return (
      <div style={{background: '#fff', padding: '0 16px'}}>
        {React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: this.toggleCollapsed
        })}
        <div style={styles.headerRight}>
          <div style={styles.headerItem}>
            <ColorPicker color={color} onChange={this.changeColor}/>
          </div>

          <div style={styles.headerItem}>
            <Menu mode="horizontal" selectable={false}>
              <SubMenu title={
                <div style={styles.avatarBox}>
                  <Avatar size='small' src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>&nbsp;
                  <span>Ali_Ming</span>
                </div>}
              >
                <MenuItemGroup title="用户中心">
                  <Menu.Item key={1} onClick={this.openEditInfoModal}><UserOutlined/>个人信息</Menu.Item>
                  <Menu.Item key={77} onClick={this.openEditPasswordModal}><EditOutlined/>修改密码</Menu.Item>
                  <Menu.Item key={2} onClick={this.onLogout}><LogoutOutlined/>退出登录</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title="设置中心">
                  <Menu.Item key={3} onClick={this.toggleFullScreen}>{isFullscreen ? <FullscreenExitOutlined/> :
                    <FullscreenOutlined/>}切换全屏</Menu.Item>
                  <Menu.Item key={4} onClick={this.resetColor}><AntDesignOutlined/>恢复默认主题</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
            </Menu>
          </div>
        </div>
        <EditInfoModal ref={e => this.EditInfoModal = e} user={user}/>
        <EditPasswordModal ref={(e) => this.EditPasswordModal = e} user={user}/>
      </div>
    );
  }
}

const styles = {
  headerRight: {
    float: 'right',
    display: 'flex',
    height: 64,
    marginRight: 50
  },
  headerItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px'
  },
  avatarBox: {
    display: 'flex',
    alignItems: 'center'
  }
};


export default MyHeader;
