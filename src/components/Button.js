import React from 'react';
import PropTypes from 'prop-types';

// Style
import styled from 'styled-components';

// components
export const Button = (props) => {
    return (
        <StyledButton onClick={props.onClick} className={props.className}>{props.text}</StyledButton>
    );
};

Button.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    text: PropTypes.string
};

const StyledButton = styled.button`
      display: inline-block;
      border: none;
      text-align: center;
      color:white;
      cursor: pointer;
      font-family: ${props => props.theme.secondaryFont};
      transition: all 150ms ease;
      font-size: 1rem;
      border-radius: 22px;
      background: ${props => props.theme.blue};
      
      &:hover {
          background-color: ${props=>props.theme.crimson};
          box-shadow: rgba(0, 0, 0, 0.18) 0px 0px 10px 0px;
      }
`;
