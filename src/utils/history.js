import {createBrowserHistory} from 'history'

const env = process.env.NODE_ENV;
let options ={};
if(env === 'production'){
  options.basename = '/admin';
}

export default createBrowserHistory(options);
