import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  padding: 16px;
  width: 100%;

  border: 2px solid #232129;
  color: #5a4b81;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: #e96379;
    `}

  ${props =>
    props.isFocused &&
    css`
      color: #ff79c6;
      border-color: #ff79c6;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #ff79c6;
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #f4ede8;

    &::placeholder {
      color: #5a4b81;
    }
  }

  svg {
    margin-right: 16px;
  }
`;
