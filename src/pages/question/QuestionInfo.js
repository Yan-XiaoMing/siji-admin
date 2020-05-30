import React, {Component} from 'react';
import {updateQuestion} from '../../api/question';
import {Form, Input, message, Modal} from 'antd';
import {formatFieldsData} from '../../utils/util';

const {TextArea} = Input;

class QuestionInfo extends Component {

  formRef = React.createRef();

  state = {
    visible: false
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    // console.log(this.formRef.current.getFieldsValue());
    this.toggleVisible(false);
  };

  handleOk = () => {
    this.formRef.current.validateFields()
      .then(async value => {
        value.id = this.props.questionData.id;
        if (value.id != null && value.id != undefined) {
          const data = await updateQuestion(value);
          const result = data.data;
          if (result.code == 0) {
            message.success(result.data);
            this.props.onUpdate();
            this.toggleVisible(false);
          } else {
            message.error(result.data);
          }
        } else {
          message.warning('id字段为空');
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
    let questionData = this.props.questionData;
    questionData = formatFieldsData(questionData);
    // console.log(questionData);
    // let test = [
    //   {
    //     "name": [
    //       "questionTitle"
    //     ],
    //     "value": "123"
    //   },
    //   {
    //     "name": [
    //       "questionContent"
    //     ],
    //     "value": "123"
    //   }
    // ];
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
        okText="修改"
        cancelText="取消"
      >
        <Form fields={questionData} ref={this.formRef}>
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

export default QuestionInfo;
