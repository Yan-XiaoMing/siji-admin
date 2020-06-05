import React, {Component} from 'react';
import {Form, Input, Modal} from 'antd';
import {formatFieldsData} from '../../utils/util';

class ActivityApply extends Component {
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
    let activityApply = this.props.activityApply;
    console.log(activityApply);
    activityApply = formatFieldsData(activityApply);

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
        okText="确定"
        cancelText="取消"
      >
        <Form fields={activityApply} ref={this.formRef}>
          <Form.Item name="name" label={'姓名'}  {...formItemLayout}
                     rules={[{required: true, message: '用户姓名不能为空'}]}>
            <Input disabled placeholder="请输入用户姓名"/>
          </Form.Item>
          <Form.Item name="phone" label={'联系方式'}  {...formItemLayout}
                     rules={[{required: true, message: '联系方式不能为空'}]}>
            <Input disabled placeholder="请输入联系方式"/>
          </Form.Item>
        </Form>

      </Modal>
    );
  }
}

export default ActivityApply;
