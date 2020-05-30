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

