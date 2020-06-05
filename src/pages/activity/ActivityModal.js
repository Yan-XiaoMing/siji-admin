import React, {Component} from 'react';
import {Form, Input, message, Upload, Button, DatePicker} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {reqDeleteImg} from '../../api/common';
import {BASE_IMG_URL} from '../../config/common';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import {addActivity} from '../../api/activity';

const {TextArea} = Input;

class ActivityModal extends Component {

  formRef = React.createRef();

  state = {
    editorState: BraftEditor.createEditorState(null),
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
    this.props.changeView(0);
  };

  onFinish = async (fieldsValue) => {
    const value = {...fieldsValue, 'time': fieldsValue['time'].format('YYYY-MM-DD HH:mm:ss')};
    if (this.state.fileList.length > 0) {
      value.image = this.state.fileList[0].name;
    } else {
      value.image = this.props.activityData.image;
    }
    value.raw = this.state.editorState.toRAW();
    value.html = this.state.editorState.toHTML();
    if (value.html === '<p></p>' || value.raw === '') {
      message.error('活动内容为空');
      return false;
    }
    console.log(value);
    const result = await addActivity(value);
    const data = result.data;
    console.log(result);
    if (data.code === 0) {
      this.props.onAdd();
      message.success('添加成功');
      this.formRef.current.resetFields();
      this.props.changeView(0);
    } else {
      message.error(data.data || data.errMsg);
    }
  };

  handleEditorState = (editorState) => {
    this.setState({
      editorState
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


  render() {
    const {fileList, editorState} = this.state;
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

    const excludeControls = ['letter-spacing',
      'line-height',
      'text-color',
      'clear',
      'headings',
      'list-ol',
      'list-ul',
      'remove-styles',
      'superscript',
      'subscript',
      'link',
      'hr',
      'blockquote',
      'text-indent',
      'emoji',
      'text-align'];

    const extendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      }
    ];


    return (
      <Form onFinish={this.onFinish} ref={this.formRef}>
        <Form.Item name="title" label={'活动标题'}  {...formItemLayout}
                   rules={[{required: true, message: '活动标题不能为空'}]} hasFeedback>
          <Input placeholder="请输入活动标题"/>
        </Form.Item>
        <Form.Item name="introduction" label={'活动简介'}  {...formItemLayout}
                   rules={[{required: true, message: '活动简介不能为空'}]} hasFeedback>
          <TextArea
            placeholder="请输入活动项目简介信息"
            autoSize={{minRows: 4, maxRows: 6}}
          />
        </Form.Item>
        <Form.Item
          name="image"
          label="活动宣传图"
          {...formItemLayout}
          rules={[{required: true, message: '活动图片为空'}]}
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
        <Form.Item
          label="活动内容"
          {...formItemLayout}
        >
          <div className='activity-editor-wrapper'>
            <BraftEditor
              ref={instance => this.editorInstance = instance}
              excludeControls={excludeControls}
              extendControls={extendControls}
              contentStyle={{height: 210}}
              value={editorState}
              onChange={this.handleEditorState}
              // media={{items: mediaItems}}
              // placeholder="请输入文章内容"
              // converts={{ unitImportFn, unitExportFn }}
            />
          </div>
        </Form.Item>
        <Form.Item
          label='活动时间'
          name='time'
          {...formItemLayout}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
        </Form.Item>
        <Form.Item
          label="提交"
          {...formItemLayout}
        >
          <Button size="large" type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default ActivityModal;
