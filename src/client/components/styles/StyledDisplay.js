import styled from 'styled-components';

export const StyledDisplay = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  padding: 20px;
  border: 4px solid #333;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  color: ${props => (props.gameOver ? 'red' : props.bob ? 'black' : '#999')};
  background: ${props => (props.bob ? 'green' : 'black')};
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 0.8rem;
`;
