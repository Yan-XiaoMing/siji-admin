import React, {Component} from 'react';
import {Form, Input, message, Modal, Upload} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {reqDeleteImg} from '../../api/common';
import {addTerm} from '../../api/term';
import {BASE_IMG_URL} from '../../config/common';

const {TextArea} = Input;

class TermAdd extends Component {

  formRef = React.createRef();

  state = {

    fileList: [
      /*{
        uid: '-1', // 每个file都有自己唯一的id
        name: 'xxx.png', // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
      },*/
    ],
    visible: false
  };

  handleCancel = async () => {
    let value = this.formRef.current.getFieldsValue();
    if (value.image !== undefined) {
      value.image = value.image.fileList[0].name;
      const result = await reqDeleteImg(value.image);
      if (result.data.code !== 0) {
        message.warning('服务器文件未被清除');
      }
    }
    this.formRef.current.resetFields();
    this.toggleVisible(false);
  };

  handleOk = async () => {
    this.formRef.current.validateFields()
      .then(async value => {
        // value.id = this.props.questionData.id;
        value.image = value.image.fileList[0].name;
        const result = await addTerm(value);
        const data = result.data;
        console.log(result);
        if (data.code === 0) {
          this.props.onAdd();
          message.success('添加成功');
          this.formRef.current.resetFields();
          this.toggleVisible(false);
        } else {
          message.error(data.data || data.errMsg);
        }
      })
      .catch(errorInfo => {
        console.log(errorInfo);
      });
  };


  /**
   *  file: 当前操作的图片文件(上传/删除)
   *  fileList: 所有已上传图片文件对象的数组
   */

  handleChange = async ({file, fileList}) => {
    // console.log('handleChange()', file.status, fileList.length, file === fileList[fileList.length - 1]);
    // 一旦上传成功, 将当前上传的file的信息修正(name, url)
    if (file.status === 'done') {
      const result = file.response;
      console.log(result);
      if (result.code === 0) {
        message.success('上传图片成功!');
        const {data} = result;
        file = fileList[fileList.length - 1];
        file.name = data;
        file.url = BASE_IMG_URL + data;
      } else {
        message.error('上传图片失败');
      }
    } else if (file.status === 'removed') { // 删除图片
      const result = await reqDeleteImg(file.name);
      if (result.data.code === 0) {
        message.success('删除图片成功!');
      } else {
        message.error('删除图片失败!');
      }
    }

    // 在操作(上传/删除)过程中更新fileList状态
    this.setState({fileList});
  };

  toggleVisible = (visible) => {
    this.setState({
      visible
    });
  };

  render() {
    const {fileList} = this.state;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 16}
    };
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (

      <Modal
        title="项目添加"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="添加"
        cancelText="取消"
      >
        <Form ref={this.formRef}>
          <Form.Item name="title" label={'项目标题'}  {...formItemLayout}
                     rules={[{required: true, message: '项目标题不能为空'}]} hasFeedback>
            <Input placeholder="请输入问题标题"/>
          </Form.Item>
          <Form.Item name="introduction" label={'项目简介'}  {...formItemLayout}
                     rules={[{required: true, message: '项目简介不能为空'}]} hasFeedback>
            <TextArea
              placeholder="请输入主培项目详情信息"
              autoSize={{minRows: 4, maxRows: 10}}
            />
          </Form.Item>
          <Form.Item
            name="image"
            label="项目图片"
            {...formItemLayout}
            rules={[{required: true, message: '项目图片为空'}]}
          >
            <Upload
              name="image"
              accept='image/*'
              listType="picture-card"
              className="avatar-uploader"
              fileList={fileList}
              action="/img/create"
              onChange={this.handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>

      </Modal>
    );
  }
}

export default TermAdd;
