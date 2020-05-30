import React, {Component} from 'react';
import {Table, Space, message, Button} from 'antd';
import Empty from 'antd/es/empty';
import {getQuestion, removeQuestion} from '../../api/question';
import LinkButton from '../../components/LinkButton';
import {PlusOutlined} from '@ant-design/icons';
import QuestionModal from './QuestionModal';
import QuestionInfo from './QuestionInfo';

import './style.less';


class Question extends Component {

  state = {
    questionData: {},
    data: [],
    loading: false
  };

  getQuestion = async () => {
    this.setState({
      loading: true
    });
    const data = await getQuestion();
    const result = data.data;
    if (result.code == 0) {
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
    const data = await removeQuestion(item.id);
    const result = data.data;
    if (result.code == 0) {
      this.getQuestion();
      message.success(result.data);
    } else {
      message.error('网络异常,请求出错');
    }
  };


  openAddModal = () => {
    this.QuestionModal.toggleVisible(true);
  };

  openInfoModal = (item) => {
    this.setState({
      questionData: item
    }, () => {
      console.log(this.state.questionData);
    });

    this.QuestionInfo.toggleVisible(true);
  };

  componentDidMount() {
    this.getQuestion();
  }

  componentDidUpdate(prevProps) {
    //当修改用户信息时，重新加载
    if (this.props.data !== prevProps.data) {
      this.getQuestion();
    }
  }

  render() {
    const columns = [
      {
        title: '问题标题',
        dataIndex: 'questionTitle',
        key: 'questionTitle',
        width: '30%'
      },
      {
        title: '问题详情',
        dataIndex: 'questionContent',
        key: 'questionContent'
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
    let {questionData, data, loading} = this.state;

    return (
      <div>
        <div className='w-question-btn'>
          <Button onClick={this.openAddModal} type="primary">新增<PlusOutlined/></Button>
        </div>
        {
          data.length != 0
            ? <Table bordered rowKey={record => record.id} columns={columns} dataSource={data}
                     pagination={{defaultPageSize: 6}} loading={loading} onChange={this.handleTableChange}/>
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }
        <QuestionModal onAdd={this.getQuestion} ref={e => {
          this.QuestionModal = e;
        }}/>
        <QuestionInfo onUpdate={this.getQuestion} questionData={questionData} ref={e => {
          this.QuestionInfo = e;
        }}/>
      </div>
    );
  }
}

export default Question;
