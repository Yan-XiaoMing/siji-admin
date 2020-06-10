import React, {Component} from 'react';
import {Form} from 'antd';
import logo from '../../asset/img/dinggao.svg';
import {login as loginRequest, checkToken} from '../../api/login';
import {message} from 'antd';
import storageUtils from '../../utils/storageUtils';
import {randomNum} from '../../utils/util';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {saveUserData} from './store/actionCreators';
import {withRouter, Redirect} from 'react-router-dom';
import './style.less';


const store = connect(
  (state) => ({user: state.user}),
  (dispatch) => bindActionCreators({saveUserData}, dispatch)
);

@withRouter @store
class Login extends Component {

  state = {
    code: ''
  };

  /**
   * 生成验证码
   */
  _createCode = () => {
    const ctx = this.canvas.getContext('2d');
    const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let code = '';
    ctx.clearRect(0, 0, 80, 39);
    for (let i = 0; i < 4; i++) {
      const char = chars[randomNum(0, 57)];
      code += char;
      ctx.font = randomNum(20, 25) + 'px SimHei';  //设置字体随机大小
      ctx.fillStyle = '#D3D7F7';
      ctx.textBaseline = 'middle';
      ctx.shadowOffsetX = randomNum(-3, 3);
      ctx.shadowOffsetY = randomNum(-3, 3);
      ctx.shadowBlur = randomNum(-3, 3);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      let x = 80 / 5 * (i + 1);
      let y = 39 / 2;
      let deg = randomNum(-25, 25);
      /**设置旋转角度和坐标原点**/
      ctx.translate(x, y);
      ctx.rotate(deg * Math.PI / 180);
      ctx.fillText(char, 0, 0);
      /**恢复旋转角度和坐标原点**/
      ctx.rotate(-deg * Math.PI / 180);
      ctx.translate(-x, -y);
    }
    this.setState({
      code
    });
  };

  onFinish = async () => {
    let values = {
      username: this.refs.username.value,
      password: this.refs.password.value
    };

    values = JSON.stringify(values);

    const result = await loginRequest(values);

    if (result.data.code === 0) {
      message.success('登录成功');
      const user = result.data.user;
      await this.props.saveUserData(user);
      // console.log(x);
      storageUtils.saveUser(user);
      this.props.history.replace('/');
    } else {
      message.error(result.data.msg);
    }
  };

  checkPhone = (rule, value) => {
    if (!value) {
      return new Promise(((resolve, reject) => {
        reject('密码必须输入');
      }));
    } else if (value.length < 6) {
      return new Promise(((resolve, reject) => {
        reject('密码不少于6位');
      }));
    } else if (value.length > 16) {
      return new Promise(((resolve, reject) => {
        reject('密码不能多于16位');
      }));
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return new Promise(((resolve, reject) => {
        reject('密码必须由英文、数字或下划线组成');
      }));
    }
  };


  async componentDidMount() {
    const user = storageUtils.getUser();
    let tempUser = JSON.stringify(user);
    console.log(tempUser);
    if (tempUser !== '{}' && tempUser !== null && tempUser !== undefined) {
      console.log('发送');
      const result = await checkToken();
      const data = result.data;
      if (data.code === 0) {
        await this.props.saveUserData(user);
        console.log('跳转');
        this.props.history.push('/');
      } else {
        storageUtils.removeUser();
      }
    }
  }

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
            onFinish={this.onFinish}
            initialValues={{
              remember: true
            }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入您的用户名!'
                }
              ]}
            >
              <div className="login-row">
                <label>username</label>
                <input ref='username' type="text" placeholder="请输入您的用户名"/>
              </div>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  validator: this.checkPhone
                }
              ]}
            >
              <div className="login-row">
                <label>password</label>
                <input ref='password' type="password" placeholder="请输入您的密码"/>
              </div>
            </Form.Item>

            <Form.Item>
              <div id="button" className="login-row">
                <button onClick={this.onFinish}>登录</button>
              </div>
            </Form.Item>
          </Form>
        </div>

      </div>
    );
  }
}

export default Login;
