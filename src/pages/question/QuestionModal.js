import React, {Component} from 'react';
import {Modal, Button, Form, Input, message} from 'antd';
import {addQuestion} from '../../api/question';

const {TextArea} = Input;

class QuestionModal extends Component {

  formRef = React.createRef();
  state = {
    visible: false
  };
  handleCancel = () => {
    this.formRef.current.resetFields();
    this.toggleVisible(false);
  };
  handleOk = () => {
    this.formRef.current.validateFields()
      .then(async value => {
        const data = await addQuestion(value);
        const result = data.data;
        if (result.code == 0) {
          message.success(result.data);
          this.props.onAdd();
          this.toggleVisible(false);
        } else {
          message.error(result.data);
        }
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });
    // const value = this.formRef.current.getFieldsValue();
  };
  toggleVisible = (visible) => {
    this.setState({
      visible
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    };
    return (

      <Modal
        title="添加问题"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Form ref={this.formRef}>
          <Form.Item name="questionTitle" label={'问题标题'}  {...formItemLayout}
                     rules={[{required: true, message: '问题标题不能为空'}]} hasFeedback>
            <Input placeholder="请输入问题标题"/>
          </Form.Item>
          <Form.Item name="questionContent" label={'问题回答'}  {...formItemLayout}
                     rules={[{required: true, message: '问题回答不能为空'}]} hasFeedback>
            <TextArea
              placeholder="请输入问题回答"
              autoSize={{minRows: 4, maxRows: 8}}
            />
          </Form.Item>
        </Form>

      </Modal>
    );
  }
}

export default QuestionModal;
