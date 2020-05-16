import React, {Component} from 'react';
import { Form } from 'antd';
import './style.less'
import logo from '../../asset/img/dinggao.svg'
import {login as loginRequest,checkToken} from '../../api/login'
import {message} from 'antd'

class Login extends Component {



  onFinish = async values => {
    console.log(values);
    const result = await loginRequest(values);
    result.then(res=>{
      if(res.code===0){
        message.success('登录成功');
        localStorage.setItem('token',res.data);
        this.props.history.replace('/');
      }
      else{
        message.error(res.message);
      }
    }).catch(err=>{
      message.error('请求出错:'+err)
    })
  };

  checkPhone = (rule, value) => {
    if (!value) {
      return new Promise(((resolve, reject) => {
        reject('密码必须输入');
      }));
    } else if (value.length<6) {
      return new Promise(((resolve, reject) => {
        reject('密码不少于6位');
      }));
    } else if (value.length > 16) {
      return new Promise(((resolve, reject) => {
        reject('密码不能多于16位');
      }));
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      return new Promise(((resolve, reject) => {
        reject('密码必须由英文、数字或下划线组成');
      }));
    }
  };
/*
  componentDidMount() {
    checkToken
  }*/

  render() {
    return (
      <div className='login-wrapper'>
        <div className='login-card'>
          <div className='login-logo'>
            <img src={logo} alt='logo'/>
          </div>
          <h2 className='login-title'>四季惠享</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入您的用户名!',
                },
              ]}
            >
              <div className="login-row">
                <label>username</label>
                <input type="text" placeholder="请输入您的用户名"/>
              </div>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  validator: this.checkPhone
                },
              ]}
            >
              <div className="login-row">
                <label>password</label>
                <input type="password" placeholder="请输入您的密码"/>
              </div>
            </Form.Item>


            <Form.Item>
              <div id="button" className="login-row">
                <button>登录</button>
              </div>
            </Form.Item>
          </Form>
        </div>

      </div>
    );
  }
}

export default Login;
