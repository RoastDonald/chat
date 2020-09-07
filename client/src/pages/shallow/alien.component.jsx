import React from 'react';
import { ReactComponent as Alien } from '../../assets/add.svg';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 300px;
  position: absolute;
  z-index: 10;
  top: ${({ page }) => (page === 'signin' ? '0' : '-5%')};
  right: ${({ page }) => (page === 'signin' ? '0' : '70%')};
`;

const AlienSvg = ({ page }) => {
  return (
    <Wrapper page={page}>
      <Alien />
    </Wrapper>
  );
};

export default AlienSvg;
