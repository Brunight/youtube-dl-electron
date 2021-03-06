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
  justify-content: center;

  width: 100%;
  max-width: 700px;
`;

export const StyledLink = styled(Link)`
  color: #f4ede8;
  display: block;
  text-decoration: none;
  transition: color 0.2s;
  margin-bottom: 24px;
  align-self: flex-start;

  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }

  &:hover {
    color: ${shade(0.2, '#f4ede8')};
  }
`;
