import React, {Component} from 'react';
import {Table, Space, message, Button} from 'antd';
import Empty from 'antd/es/empty';
import LinkButton from '../../components/LinkButton';
import {getOpinion, removeOpinion} from '../../api/opinion';
import OpinionInfo from './OpinionInfo';

class Opinion extends Component {

  state = {
    opinionData: {},
    data: [],
    loading: false
  };

  openInfoModal = (item) => {
    this.setState({
      opinionData: item
    }, () => {
      // console.log(this.state.opinionData);
    });
    this.OpinionInfo.toggleVisible(true);
  };

  getOpinion = async () => {
    this.setState({
      loading: true
    });
    const data = await getOpinion();
    const result = data.data;
    if (result.code === 0) {
      this.setState({
        loading: false,
        data: result.data
      });
    } else {
      this.setState({
        loading: false
      });
      message.error('网络异常,请求出错');
    }
  };
  removeItem = async (item) => {
    const data = await removeOpinion(item.id);
    const result = data.data;
    if (result.code === 0) {
      message.success(result.data);
      this.getOpinion();
    } else {
      message.error(result.msg);
    }
  };

  async componentDidMount() {
    await this.getOpinion();
  }

  render() {
    const columns = [
      {
        title: '星级打分',
        dataIndex: 'score',
        key: 'score',
        width: '8%'
      },
      {
        title: '评论',
        dataIndex: 'comment',
        key: 'comment'
      },
      {
        title: '提交时间',
        dataIndex: 'commentTime',
        key: 'commentTime',
        sorter: {
          compare: (a, b) => {
            let aTimeString = a.commentTime;
            let bTimeString = b.commentTime;
            let aTime = new Date(aTimeString).getTime();
            let bTime = new Date(bTimeString).getTime();
            return aTime - bTime;
          }
        },
        width: '30%'
      },
      {
        title: '操作',
        key: 'action',
        render: (item) => (
          <Space size="middle">
            <LinkButton onClick={() => this.openInfoModal(item)}>查看详情</LinkButton>
            <Button type="primary" onClick={() => this.removeItem(item)}>删除</Button>
          </Space>
        ),
        width: '20%'
      }
    ];
    const {data, opinionData, loading} = this.state;
    return (
      <div>
        {
          data.length !== 0 ?
            <Table bordered rowKey={record => record.id} columns={columns} dataSource={data}
                   pagination={{defaultPageSize: 6}}
                   loading={loading}/> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }
        <OpinionInfo opinionData={opinionData} ref={e => {
          this.OpinionInfo = e;
        }}/>
      </div>
    );
  }
}

export default Opinion;
