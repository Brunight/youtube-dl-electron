import styled from 'styled-components';
import { shade } from 'polished';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  place-content: center;
  padding: 16px 0px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  place-content: center;

  width: 100%;
  max-width: 700px;

  form {
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;

    place-content: center;

    input + svg {
      margin-top: 16px;
      margin-bottom: 16px;
    }
  }
`;

export const StyledLink = styled(Link)`
  color: #f4ede8;
  display: block;
  margin-top: 24px;
  text-decoration: none;
  transition: color 0.2s;

  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }

  &:hover {
    color: ${shade(0.2, '#f4ede8')};
  }
`;
