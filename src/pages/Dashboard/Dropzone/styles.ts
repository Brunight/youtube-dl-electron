import styled, { css } from 'styled-components';
import { lighten } from 'polished';

interface DropzoneProps {
  isDragging: boolean;
}

export const DropzoneContainer = styled.div<DropzoneProps>`
  background: ${lighten(0.1, '#191622')};
  border: dashed 1px #1f1f1f;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.1s;

  ${props =>
    props.isDragging &&
    css`
      border-color: #ff79c6;
    `}

  &:hover {
    background: ${lighten(0.2, '#191622')};
  }

  &:focus {
    outline: 0;
  }

  &:active {
    border-color: #ff79c6;
  }
`;

export const Title = styled.p`
  pointer-events: none;
  font-size: 16px;
  margin-bottom: 5px;
`;

export const SubTitle = styled.p`
  pointer-events: none;
  font-size: 12px;
`;
