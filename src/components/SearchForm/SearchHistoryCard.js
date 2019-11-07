import React from "react";
import PropTypes from "prop-types";

// Style
import styled from "styled-components";

// Components
import { Button } from "../Button";
import {fadeInAnimation} from "../../styles/animations";

// components
export const SearchHistoryCard = props => {
  const handleDeleteOnClick = () => {
    props.deleteItem(props.index);
  };

  return (
    <Root index={props.index} isActive={props.isActive}>
      <Title>{props.name}</Title>
        <RightContainer>
          <TimeStamp>{props.timeStamp}</TimeStamp>
          <DeleteButton type="button" onClick={handleDeleteOnClick} text="Delete" />
        </RightContainer>
    </Root>
  );
};

SearchHistoryCard.propTypes = {
  name: PropTypes.string,
  index: PropTypes.number,
  timeStamp: PropTypes.string,
  deleteItem: PropTypes.func,
  isActive: PropTypes.bool
};

const Root = styled.li`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.theme.pink};
  padding: 0.5rem 0;
  animation: 250ms ${fadeInAnimation};
    @media ${props => props.theme.breakpointXSmall} {
      flex-direction:row;
    }
`;

const Title = styled.span`
  padding: 0;
  word-break: break-word;
  width:100%;
  margin:0.5rem 0;
  @media ${props => props.theme.breakpointXSmall} {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    width:60%;
  }
`;

const RightContainer = styled.div`
  display:flex;
  flex-direction: column;
  width:100%;
  @media ${props => props.theme.breakpointXSmall} {
  width:40%;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const TimeStamp = styled.span`
  font-size: 13px;
  padding: 0;
  margin:0.5rem 0;
    font-style: italic;
  @media ${props => props.theme.breakpointXSmall} {
    padding: 0 1rem;
  }
`;

const DeleteButton = styled(Button)`
  position: relative;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  font-weight: bold;
  background: ${props => props.theme.crimson};
  font-size: 14px;
  border-radius: 0;

  &::after {
    position: absolute;
    content: "\\2715";
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    height: 1.25rem;
    width: 1.25rem;
    font-weight: bold;
    color: black;
    text-align: center;
    z-index: 1;
    border-radius: 50%;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }
`;
