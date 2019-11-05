import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Style
import styled, {css} from 'styled-components';


export const Layout = (props) => {
    //Outlines are hidden on focus, but if user is tabbing we show them to let user see what element is selected.
    const handleFirstTab = (e) => {
            console.log('handleFirstTab');
        if (e.keyCode === 9 && !userIsTabbing) {
            setUserIsTabbing(true);
        }
    };

    // init listener on keydown.
    useEffect(()=>{
        if(window){
            window.addEventListener('keydown', handleFirstTab);
        }
    },[]);

    const [userIsTabbing, setUserIsTabbing ] = useState(false);

    return (
        <Root userIsTabbing={userIsTabbing}>
            {props.children}
        </Root>
    );
};

Layout.propTypes = {
    children: PropTypes.node
};

const outlineDefaults = css`
  outline: 5px auto rgba(0, 150, 255, 1); 
  -webkit-outline: 5px auto rgba(0, 150, 255, 1); 
  -moz-outline: 5px auto rgba(0, 150, 255, 1);
  -ms-outline: 5px auto rgba(0, 150, 255, 1);
  -o-outline: 5px auto rgba(0, 150, 255, 1);
  border: 1px solid rgba(0, 0, 0, 0);
`;

const Root = styled.section`
  width:100%;
  height:100vh;
  background: ${props => props.theme.grey};
  padding:0 1rem;
  box-sizing: border-box;
  font-family: ${props => props.theme.secondaryFont};
  button:focus,
  input:focus,
  select:focus,
  textarea:focus {
    outline: ${props => props.userIsTabbing ?
    outlineDefaults
    : 'none'};
  }
  
`;
