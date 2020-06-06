import React, {Component} from 'react';
import {Tabs} from 'antd';
import Swiper from '../../components/Swiper/Swiper';
import './style.less';

const TabPane = Tabs.TabPane;

class MyContent extends Component {

  onChange = (activeKey) => {
    this.props.onChangeState({
      activeMenu: activeKey
    });
  };

  onEdit = (targetKey, action) => {
    if (action === 'remove') {
      this.remove(targetKey);
    }
  };

  remove = (targetKey) => {
    let activeMenu = this.props.activeMenu;
    let panes = this.props.panes.slice();
    let preIndex = panes.findIndex(item => item.key === targetKey) - 1;
    preIndex = Math.max(preIndex, 0);
    panes = panes.filter(item => item.key !== targetKey);

    if (targetKey === activeMenu) {
      activeMenu = panes[preIndex] ? panes[preIndex].key : '';
    }
    this.props.onChangeState({
      activeMenu, panes
    });
  };

  render() {
    const {panes, activeMenu} = this.props;
    return (
      <div className='w-myContent'>
        {
          panes.length ? (
              <Tabs
                tabBarStyle={{background: '#f0f2f5', marginBottom: 0}}
                onEdit={this.onEdit}
                onChange={this.onChange}
                activeKey={activeMenu}
                type="editable-card"
                hideAdd
              >
                {panes.map(item =>
                  (<TabPane key={item.key} tab={item.name} style={{padding: 24}}>
                    {item.content}
                  </TabPane>))
                }
              </Tabs>
            )
            : <div className='myContent-default-bg'>
              <Swiper/>
            </div>
        }
      </div>
    );
  }
}

export default MyContent;
