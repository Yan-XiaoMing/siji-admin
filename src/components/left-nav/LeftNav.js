import React, {Component} from 'react';
import {Layout, Menu} from 'antd';
import {HomeOutlined, PushpinOutlined, CommentOutlined} from '@ant-design/icons';
import {Link, withRouter} from 'react-router-dom';
import logo from '../../asset/img/dinggao.svg';
import menuList from '../../config/menuList';
import './style.less';

const {Sider} = Layout;
const {SubMenu} = Menu;

class LeftNav extends Component {

  state = {
    collapsed: false
  };
  //
  // getMenuNodes_map = (menuList) => {
  //
  //   const path = this.props.location.pathname;
  //
  //   return menuList.map(item => {
  //     if (!item.children) {
  //       return (
  //         <Menu.Item key={item.key} icon={item.icon}>
  //           <Link to={item.key}>
  //             {item.title}
  //           </Link>
  //         </Menu.Item>
  //       );
  //     } else {
  //       if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
  //         this.openKey = item.key;
  //       }
  //       return (
  //         <SubMenu key={item.key} title={item.title} icon={item.icon}>
  //
  //         </SubMenu>
  //       );
  //     }
  //   });
  // };

  render() {

    const {collapsed} = this.props;
    let path = this.props.location.pathname;
    console.log(path);


    return (
      <Sider className="site-item site-layout-background" width={200} trigger={null} collapsible collapsed={collapsed}>
        <Link to='/home'>
          <div className="logo logo-bg">
            <div className='w-logo-img'>
              <img src={logo} alt='logo'/>
            </div>
          </div>
        </Link>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
        >
          <Menu.Item key="/home" icon={<HomeOutlined/>}>
            主培项目
          </Menu.Item>
          <Menu.Item key="/activity" icon={<PushpinOutlined/>}>
            活动信息
          </Menu.Item>
          <SubMenu key="/advisory" icon={<CommentOutlined/>} title="教育咨询">
            <Link to={}>
              <Menu.Item key="/problem">常见问题</Menu.Item>
            </Link>
            <Menu.Item key="/oneToOne">一对一咨询</Menu.Item>
            <Menu.Item key="/suggestion">意见箱</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(LeftNav);
