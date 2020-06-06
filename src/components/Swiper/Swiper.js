import React, {useState} from 'react';
import {interpolate, animated, useSpring} from 'react-spring';
import {useDrag} from 'react-use-gesture';
import {imgData} from '../../config/imageData';
import './style.less';

const Card = props => {
  const {_x, _y, num, index, data, active} = props;
  const cardIndex = num - index;
  const offset = cardIndex * 560 + 100;
  const [{x, y, scale}, set] = useSpring(() => ({
    x: _x + offset,
    y: _y,
    scale: active ? 2.4 : 1
  }));
  const [{blur}, setPro] = useSpring(() => ({
    posX: 0,
    posY: 0,
    proScale: 1.2,
    config: {mass: 2},
    blur: 0
  }));
  set({x: _x + offset, y: _y});
  if (num === index) {
    if (!active) {
      set({scale: 1});
      setPro({posX: 0, posY: 0, proScale: 1, blur: 0});
    }
  }
  return (
    <animated.div
      id="card"
      style={{
        transform: interpolate(
          [
            x.interpolate(x => `translateX(${x}px)`),
            y.interpolate(y => `translateY(${y}px)`)
          ],
          (translateX, translateY) => `${translateX} ${translateY}`
        ),
        zIndex: num === index ? 10 : 1
      }}
    >
      <animated.div
        id="imgContainer"
        style={{
          transform: scale.interpolate(s => `scale(${s})`)
        }}
      >
        <animated.img
          style={{
            width: '300%',
            userSelect: 'none',
            transform: x
              .interpolate({range: [-196, 356], output: [-380, -20]})
              .interpolate(x => `translate3d(${x - 350}px, 0px, 0px)`)
          }}
          src={data.url}
        />
        <animated.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '0',
            backdropFilter: blur.interpolate(x => `blur(${x}px)`),
            backgroundColor: blur
              .interpolate({range: [0, 4], output: [0, 0.3]})
              .interpolate(x => `rgba(0, 0, 0, ${x})`)
          }}
        />
      </animated.div>
    </animated.div>
  );
};
const heightOffset = 0;
const Title = (

  <h1 className='swiper-title'>
    <span>四</span><span>季</span><span>惠</span><span>享</span><span>!</span>
  </h1>
);


export default function Swiper() {
  const [{x, y}, set] = useState(() => ({x: 0, y: heightOffset}));
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(false);
  const bind = useDrag(
    ({down, movement: [x, y], distance, direction: [xDir], velocity}) => {
      const trigger = velocity > 0.2;
      const dir = xDir < 0 ? -1 : 1;
      if (!active) {
        if (trigger && !down) {
          if (!(index + dir * -1 >= imgData.length || index + dir * -1 < 0)) {
            setIndex(index + dir * -1);
          }
          set({x: 0, y: heightOffset});
        } else {
          set({x: down ? x : 0, y: heightOffset});
        }
      }
    }
  );
  return (
    <div id="app" {...bind()}>
      {Title}
      {imgData.map((data, i) => {
        return (
          <Card
            key={i}
            _x={x}
            _y={y}
            num={i}
            index={index}
            data={data}
            active={active}
            setActive={setActive}
          />
        );
      })}
    </div>
  );
}
