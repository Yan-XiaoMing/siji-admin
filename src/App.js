import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Login from './pages/login/Login';
import Container from './pages/container/Container';

class App extends React.Component{
  render() {
    return (
      <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/' component={Container}/>
      </Switch>
    );
  }
}

export default App;
