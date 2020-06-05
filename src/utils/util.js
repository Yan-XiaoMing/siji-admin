/**
 * 生成指定区间的随机整数
 * @param min
 * @param max
 * @returns {number}
 */
export function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


/**
 * 格式化antd表单数据格式
 * @param data
 * @returns Array
 */
export function formatFieldsData(data) {
  let arr = [];
  for (let name in data) {
    let item = {
      'name': [],
      'value': ''
    };
    item.name.push(name);
    item.value = data[name];
    arr.push(item);
  }
  return arr;
}

/**
 * 将img标签转换为【图片】
 * @param {string} str
 */
export function replaceImg(str) {
  if (typeof str === 'string') {
    str = str.replace(/<img(.*?)>/g, '[图片]');
  }
  return str;
}


/**
 * 节流函数
 * @param {*} func
 * @param {*} interval
 */
export function throttle(func, interval = 100) {
  let timeout;
  let startTime = new Date();
  return function (event) {
    event.persist && event.persist();   //保留对事件的引用
    clearTimeout(timeout);
    let curTime = new Date();
    if (curTime - startTime <= interval) {
      //小于规定时间间隔时，用setTimeout在指定时间后再执行
      timeout = setTimeout(() => {
        func(event);
      }, interval);
    } else {
      //重新计时并执行函数
      startTime = curTime;
      func(event);
    }
  };
}


export function buildPreviewHtml(data) {
  return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${data}</div>
        </body>
      </html>
    `;
}
