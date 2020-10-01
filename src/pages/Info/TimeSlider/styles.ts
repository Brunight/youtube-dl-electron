import styled from 'styled-components';
import ReactSlider from 'react-slider';

interface SliderTrackProps {
  index: number;
}

export const Container = styled.div`
  width: 700px;
`;

export const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 25px;
`;

export const StyledThumb = styled.div`
  height: 30px;
  line-height: 25px;
  width: 30px;
  text-align: center;
  background-color: #5a4b81;
  color: #fff;
  border-radius: 50%;
  transform: translate(0, -3px);
  cursor: grab;
`;

export const StyledTrack = styled.div<SliderTrackProps>`
  top: 0;
  bottom: 0;
  background: ${props => (props.index === 1 ? '#FF79C6' : '#ddd')};
  border-radius: 999px;
`;

export const TimerContainer = styled.div`
  width: 100%;
  display: inline-block;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;

  input {
    text-align: center;
    width: 125px;
    border-radius: 10px;
    font-size: 20px;
    float: left;
  }

  input + input {
    float: right;
  }
`;
