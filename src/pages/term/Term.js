import React, {Component} from 'react';
import {Table, Space, message, Button, Empty} from 'antd';
import LinkButton from '../../components/LinkButton';
import {PlusOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router-dom';
import {getTermList, removeTerm} from '../../api/term';
import TermDetail from './TermDetail';
import TermAdd from './TermAdd';

@withRouter
class Term extends Component {

  state = {
    type: 0,
    termItem: {},
    termData: [],
    loading: false
  };

  getTerm = async () => {
    this.setState({
      loading: true
    });
    const data = await getTermList();
    const result = data.data;
    // eslint-disable-next-line eqeqeq
    if (result.code == 0) {
      this.setState({
        loading: false,
        termData: result.data
      });
    } else {
      this.setState({
        loading: false
      });
      message.error('网络异常,请求出错');
    }
  };
  //
  removeItem = async (item) => {
    // const data = await removeQuestion(item.id);
    // const result = data.data;
    // if (result.code == 0) {
    //   this.getQuestion();
    //   message.success(result.data);
    // } else {
    //   message.error('网络异常,请求出错');
    // }
  };

  //
  async componentDidMount() {
    await this.getTerm();
  }

  //
  componentDidUpdate(prevProps) {
    //当修改用户信息时，重新加载
    if (this.props.termData !== prevProps.termData) {
      this.getTerm();
    }
  }

  openInfoModal = (item) => {
    this.setState({
      termItem: item
    }, () => {
      console.log(this.state.termItem);
    });

    this.TermDetail.toggleVisible(true);
  };
  openAddModal = () => {
    this.TermAdd.toggleVisible(true);
  };


  render() {
    const columns = [
      {
        title: '项目标题',
        dataIndex: 'title',
        key: 'title',
        width: '30%'
      },
      {
        title: '项目详情',
        dataIndex: 'introduction',
        key: 'introduction'
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
    let {termData, termItem, loading} = this.state;

    return (
      <div>
        <div className='w-question-btn'>
          <Button onClick={this.openAddModal} type="primary">新增<PlusOutlined/></Button>
        </div>
        {
          termData.length !== 0
            ? <Table bordered rowKey={record => record.id} columns={columns} dataSource={termData}
                     pagination={{defaultPageSize: 6}} loading={loading}/>
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }
        <TermAdd onAdd={this.getTerm} ref={e => {
          this.TermAdd = e;
        }}/>
        <TermDetail onUpdate={this.getTerm} termData={termItem} ref={e => {
          this.TermDetail = e;
        }}/>
      </div>
    );
  }
}

export default Term;
