import styled from 'styled-components';

export const StyledButton = styled.button`
      display: inline-block;
      border: none;
      transition: all 150ms ease;
      text-align: center;
      color:white;
      cursor: pointer;
      font-family: ${props => props.theme.secondaryFont};
      transition:all 150ms ease;
      font-size: 1rem;
      border-radius: 22px;
      background: ${props => props.theme.pink};
  &:hover {
      background-color: ${props=>props.theme.orange};
  }
`;
