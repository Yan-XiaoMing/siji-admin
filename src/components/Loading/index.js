import React, {Component} from 'react';
import './style.less';


class Loading extends Component {
  render() {
    return (
      <div id="my-loading">
        <div className="loader"/>
        <div className="shadow"/>
      </div>
    );
  }
}

export default Loading;

//https://codepen.io/MarioDesigns/pen/LLrVLK
