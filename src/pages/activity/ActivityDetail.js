import React, {Component} from 'react';
import {Form, Input, message, Upload, Button, DatePicker} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {reqDeleteImg} from '../../api/common';
import {updateActivity} from '../../api/activity';
import {BASE_IMG_URL} from '../../config/common';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import {buildPreviewHtml, formatFieldsData} from '../../utils/util';
import moment from 'moment';

const {TextArea} = Input;

class ActivityDetail extends Component {

  formRef = React.createRef();

  constructor(props) {
    super(props);
    let fileItem = {
      uid: -1,
      name: props.activityData.image,
      status: 'done',
      url: BASE_IMG_URL + props.activityData.image
    };
    this.state = {
      editorState: BraftEditor.createEditorState(this.props.activityData.raw),
      fileList: [
        /*{
          uid: '-1', // 每个file都有自己唯一的id
          name: 'xxx.png', // 图片文件名
          status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
        },*/
        fileItem
      ]
    };

  }

  handleCancel = async () => {
    let value;
    if (this.state.fileList.length > 0) {
      value = this.state.fileList[0].name;
    } else {
      value = null;
    }
    // console.log(value);
    if (value !== undefined && value !== null && value !== this.props.activityData.image) {
      const result = await reqDeleteImg(value);
      if (result.data.code !== 0) {
        message.warning('服务器文件未被清除');
      }
    }
    // else{
    //   console.log('不执行');
    // }
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
    value.id = this.props.activityData.id;
    if (value.html === '<p></p>' || value.raw === '') {
      message.error('活动内容为空');
      return false;
    }
    const result = await updateActivity(value);
    const data = result.data;
    if (data.code === 0) {
      this.props.onUpdate();
      message.success('修改成功');
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
      const result = await file.response;
      console.log(result);
      if (result.code === 0) {
        message.success('上传图片成功!');
        const {data} = result;
        const fileItem = {
          uid: -1,
          name: data,
          status: 'done',
          url: BASE_IMG_URL + data
        };
        fileList[fileList.length - 1] = fileItem;
      } else {
        message.error('上传图片失败');
      }
    } else if (file.status === 'removed') { // 删除图片
      if (file.name !== this.props.activityData.image) {
        console.log('123');
        const result = await reqDeleteImg(file.name);
        if (result.data.code === 0) {
          message.success('删除图片成功!');
        } else {
          message.error('删除图片失败!');
        }
      } else {
        message.success('删除图片成功!');
      }
    }
    this.setState({fileList});
  };


  preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close();
    }
    window.previewWindow = window.open();
    window.previewWindow.document.write(buildPreviewHtml(this.state.editorState.toHTML()));
    window.previewWindow.document.close();

  };

  // componentDidMount() {
  //   const fileItem = {
  //     uid: -1,
  //     name: this.props.activityData.image,
  //     status: 'done',
  //     url: BASE_IMG_URL + this.props.activityData.image
  //   };
  //   this.setState({
  //     fileList: [fileItem]
  //   }, () => {
  //     // console.log(this.state.fileList);
  //   });
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.activityData !== prevProps.activityData) {
      const fileItem = {
        uid: -1,
        name: this.props.activityData.image,
        status: 'done',
        url: BASE_IMG_URL + this.props.activityData.image
      };
      this.setState({
        fileList: [fileItem]
      }, () => {
        // console.log(this.state.fileList);
      });
    }
    if (this.props.open !== prevProps.open) {
      if (this.state.fileList.length === 0) {
        const fileItem = {
          uid: -1,
          name: this.props.activityData.image,
          status: 'done',
          url: BASE_IMG_URL + this.props.activityData.image
        };
        this.setState({
          fileList: [fileItem]
        }, () => {
          // console.log(this.state.fileList);
        });
      }
    }
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 16}
    };

    const {fileList, editorState} = this.state;
    let activityData = {...this.props.activityData};
    activityData.time = moment(activityData.time);
    activityData = formatFieldsData(activityData);
    console.log(activityData);

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
      <Form onFinish={this.onFinish} fields={activityData} ref={this.formRef}>
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
          label="确认修改"
          {...formItemLayout}
        >
          <Button size="large" type="primary" htmlType="submit">修改</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default ActivityDetail;
