import React, {Component, Fragment} from 'react';
import {Table, Space, message, Button, Empty, Statistic} from 'antd';
import LinkButton from '../../components/LinkButton';
import {PlusOutlined, CloseCircleOutlined, RollbackOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router-dom';
import {getActivityList, getApplyList, removeActivity} from '../../api/activity';
import ActivityApply from './ActivityApply';
import ActivityDetail from './ActivityDetail';
import ActivityModal from './ActivityModal';
import './style.less';

@withRouter
class Activity extends Component {

  state = {
    open: 0,
    activityItem: {},
    activityData: [],
    loading: false,
    activityApply: [],
    applyItem: {}
  };

  getActivity = async () => {
    this.setState({
      loading: true
    });
    const data = await getActivityList();
    const result = data.data;
    // eslint-disable-next-line eqeqeq
    if (result.code == 0) {
      this.setState({
        loading: false,
        activityData: result.data
      });
    } else {
      this.setState({
        loading: false
      });
      message.error('网络异常,请求出错');
    }
  };
  //
  // removeItem = async (item) => {
  // const data = await removeQuestion(item.id);
  // const result = data.data;
  // if (result.code == 0) {
  //   this.getQuestion();
  //   message.success(result.data);
  // } else {
  //   message.error('网络异常,请求出错');
  // }
  // };

  getApply = async (id) => {
    this.setState({
      loading: true
    });
    const data = await getApplyList(id);
    const result = data.data;
    if (result.code === 0) {
      this.setState({
        loading: false,
        activityApply: result.data
      });
    } else {
      this.setState({
        loading: false
      });
      message.error('网络异常,请求出错');
    }
  };

  openApply = (item) => {
    this.setState({
      applyItem: item
    }, () => {
      // console.log(this.state.opinionData);
    });
    this.ActivityApply.toggleVisible(true);
  };

  openInfoModal = (item, open) => {
    if (open === 3) {
      this.getApply(item.id);
    }
    this.setState({
      activityItem: item
    }, () => {
      console.log(this.state.activityItem);
    });
    this.changeView(open);
  };


  changeView = (open) => {
    this.setState({
      open
    });
  };

  removeActivity = async (item) => {
    let data = {};
    data.id = item.id;
    data.image = item.image;
    const req = await removeActivity(data);
    const result = req.data;
    if (result.code == 0) {
      message.success('删除成功');
      await this.getActivityList();
    } else {
      message.error(result.errMsg || result.data || '删除异常');
    }
  };


  onCancel = () => {
    if (this.state.open === 1) {
      this.ActivityModal.handleCancel();
    } else if (this.state.open === 2) {
      this.ActivityDetail.handleCancel();
    }

    this.changeView(0);
  };

  async componentDidMount() {
    await this.getActivity();
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.props.activityData !== prevProps.activityData) {
      this.getActivity();
    }
  }


  render() {
    let {activityData, activityItem, loading, open, activityApply, applyItem} = this.state;

    const columns = [
      {
        title: '活动标题',
        dataIndex: 'title',
        key: 'title',
        width: '18%'
      },
      {
        title: '活动简介',
        dataIndex: 'introduction'
      },
      {
        title: '活动时间',
        dataIndex: 'time',
        key: 'time',
        sorter: {
          compare: (a, b) => {
            let aTimeString = a.time;
            let bTimeString = b.time;
            let aTime = new Date(aTimeString).getTime();
            let bTime = new Date(bTimeString).getTime();
            return aTime - bTime;
          }
        },
        width: '14%'
      },
      {
        title: '报名情况',
        key: 'people',
        width: '10%',
        render: (item) => (
          <Space size="middle">
            <LinkButton onClick={() => this.openInfoModal(item, 3)}>查看详情</LinkButton>
          </Space>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (item) => (
          <Space size="middle">
            <LinkButton onClick={() => this.openInfoModal(item, 2)}>活动详情</LinkButton>
            <Button type="primary" onClick={() => this.removeActivity(item)}>删除活动</Button>
          </Space>
        ),
        width: '19%'
      }
    ];

    const applyColumn = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '30%'
      },
      {
        title: '联系方式',
        dataIndex: 'phone'
      },
      {
        title: '操作',
        key: 'action',
        render: (item) => (
          <Space size="middle">
            <LinkButton onClick={() => this.openApply(item)}>信息详情</LinkButton>
            <Button type="primary" onClick={() => this.removeItem(item)}>删除成员</Button>
          </Space>
        ),
        width: '25%'
      }
    ];

    let content = (activityData.length !== 0
      ? <Table bordered rowKey={record => record.id} columns={columns} dataSource={activityData}
               pagination={{defaultPageSize: 6}} loading={loading}/>
      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>);
    if (open === 1) {
      content = (
        <ActivityModal changeView={this.changeView} onAdd={this.getActivity} ref={e => {
          this.ActivityModal = e;
        }}/>
      );
    } else if (open === 2) {
      content = (
        <ActivityDetail changeView={this.changeView} open={this.state.open} onUpdate={this.getActivity}
                        activityData={activityItem} ref={e => {
          this.ActivityDetail = e;
        }}/>
      );
    } else if (open === 3) {
      let value = '暂无人报名';
      if (activityApply.length > 0) {
        value = activityApply.length + '人';
      }
      content = (
        <Fragment><Statistic style={{marginBottom: '10px'}} title={this.state.activityItem.title} value={value}/>
          <Table bordered rowKey={record => record.id} columns={applyColumn} dataSource={activityApply}
                 pagination={{defaultPageSize: 6}} loading={loading}/>
          <ActivityApply activityApply={applyItem} ref={e => {
            this.ActivityApply = e;
          }}/>
        </Fragment>
      );
    }

    let buttonControl = (
      <Button onClick={() => this.changeView(1)} type="primary">新增活动<PlusOutlined/></Button>
    );
    if (open === 3) {
      buttonControl = (<Fragment>
        <Button style={{float: 'left'}} onClick={this.onCancel} danger><RollbackOutlined/>返回</Button>
      </Fragment>);
    } else if (open !== 0) {
      buttonControl = (<Button onClick={this.onCancel} type="primary" danger>取消<CloseCircleOutlined/></Button>);
    }


    return (
      <div>
        <div className='w-question-btn'>
          {buttonControl}
        </div>
        {content}
      </div>
    );
  }
}

export default Activity;
