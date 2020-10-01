import styled from 'styled-components';
import DropzoneComponent from './Dropzone';

export const Container = styled.div`
  display: flex;
  place-content: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  place-content: center;

  margin-top: 16px;
  width: 100%;
  max-width: 700px;

  svg {
    margin-bottom: 48px;
  }

  h1 {
    margin-bottom: 20px;
  }

  input {
    background: #232129;
    border-radius: 10px;
    border: 2px solid #232129;
    padding: 16px;
    width: 100%;
    color: #f4ede8;
    margin-bottom: 20px;

    &::placeholder {
      color: #666360;
    }

    & + input {
      margin-top: 8px;
    }
  }
`;

export const Dropzone = styled(DropzoneComponent)``;
