import React, {Component} from 'react';
import {Form, Input, message, Modal} from 'antd';
import {addApply} from '../../api/activity';

class ActivityAdd extends Component {
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
        const data = await addApply(value);
        const result = data.data;
        if (result.code === 0) {
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

        title="个人信息"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="添加"
        cancelText="取消"
      >
        <Form ref={this.formRef}>
          <Form.Item name="name" label={'姓名'}  {...formItemLayout}
                     rules={[{required: true, message: '用户姓名不能为空'}]}>
            <Input placeholder="请输入用户姓名"/>
          </Form.Item>
          <Form.Item name="phone" label={'联系方式'}  {...formItemLayout}
                     rules={[{required: true, message: '联系方式不能为空'}]}>
            <Input placeholder="请输入联系方式"/>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ActivityAdd;
