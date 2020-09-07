import React from 'react';
import './back-svg.styles.scss';
const BackSvg = () => {
  return (
    <div className='background-svg'>
      <div className='background-wrapper'>
        <svg
          width='900'
          height='700'
          viewBox='0 0 1000 850'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <linearGradient
            id='PSgrad_0'
            x1='70.711%'
            x2='0%'
            y1='70.711%'
            y2='0%'
          >
            <stop offset='0%' stopColor='#F52FA6' stopOpacity='1' />
            <stop offset='100%' stopColor='#FF8A00' stopOpacity='1' />
          </linearGradient>
          <path fill='url(#PSgrad_0)' />
        </svg>
      </div>
    </div>
  );
};

export default BackSvg;
