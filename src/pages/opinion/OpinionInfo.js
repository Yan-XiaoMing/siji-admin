import React, {Component} from 'react';
import {Form, Input, Modal, Rate} from 'antd';
import {formatFieldsData} from '../../utils/util';

const {TextArea} = Input;

class OpinionInfo extends Component {
  formRef = React.createRef();

  state = {
    visible: false
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.toggleVisible(false);
  };

  handleOk = () => {
    this.formRef.current.resetFields();
    this.toggleVisible(false);
  };

  toggleVisible = (visible) => {
    this.setState({
      visible
    });
  };

  render() {
    let opinionData = this.props.opinionData;
    opinionData = formatFieldsData(opinionData);

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    };
    return (
      <Modal

        title="问题详情"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form fields={opinionData} ref={this.formRef}>
          <Form.Item name="commentTime" label={'提交时间'}  {...formItemLayout}
                     rules={[{required: true, message: '提交时间不能为空'}]}>
            <Input disabled placeholder="请输入问题标题"/>
          </Form.Item>
          <Form.Item name="score" label="评分"  {...formItemLayout}>
            <Rate disabled/>
          </Form.Item>
          <Form.Item name="comment" label={'评论'}  {...formItemLayout}
                     rules={[{required: true, message: '问题回答不能为空'}]}>
            <TextArea
              disabled
              placeholder="请输入问题回答"
              autoSize={{minRows: 4, maxRows: 10}}
            />
          </Form.Item>
        </Form>

      </Modal>
    );
  }
}

export default OpinionInfo;
