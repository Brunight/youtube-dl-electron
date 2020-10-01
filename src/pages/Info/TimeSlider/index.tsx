import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';

import {
  Container,
  StyledSlider,
  StyledThumb,
  StyledTrack,
  TimerContainer,
} from './styles';

interface TimeSliderProps {
  timeMs: number;
  onChange(timedata: ChangeEventData): void;
}

export interface ChangeEventData {
  start: string;
  end: string;
  duration: string;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ timeMs, onChange }) => {
  const [startTimeMs, setStartTimeMs] = useState(0);
  const [endTimeMs, setEndTimeMs] = useState(0);
  const [sliderPos, setSliderPos] = useState([0, 100]);

  const formatTime = useCallback((timeInMs: number): string => {
    return new Date(timeInMs).toISOString().slice(11, -1);
  }, []);

  useEffect(() => {
    setEndTimeMs(timeMs);
  }, [timeMs]);

  useEffect(() => {
    if (onChange) {
      onChange({
        start: formatTime(startTimeMs),
        end: formatTime(endTimeMs),
        duration: formatTime(endTimeMs - startTimeMs),
      });
    }
  }, [onChange, formatTime, startTimeMs, endTimeMs]);

  const handleSlide = useCallback(
    (e: number[]) => {
      setStartTimeMs((e[0] / 100) * timeMs);
      setEndTimeMs((e[1] / 100) * timeMs);
      setSliderPos(e);
    },
    [timeMs],
  );

  const handleTextChange = useCallback(
    (e: HTMLInputElement) => {
      const time = moment.duration(e.value);
      if (time.isValid() && time.asMilliseconds() < timeMs) {
        if (e.name === 'start') {
          handleSlide([
            Math.round(((time.asMilliseconds() * 100) / timeMs) * 10) / 10,
            sliderPos[1],
          ]);
        }
        if (e.name === 'end') {
          handleSlide([
            sliderPos[0],
            Math.round(((time.asMilliseconds() * 100) / timeMs) * 10) / 10,
          ]);
        }
      }
    },
    [timeMs, sliderPos, handleSlide],
  );

  return (
    <Container>
      <StyledSlider
        value={sliderPos}
        step={0.1}
        defaultValue={[0, 100]}
        renderTrack={(props, state) => (
          <StyledTrack {...props} index={state.index} />
        )}
        renderThumb={props => <StyledThumb {...props} />}
        onChange={e => handleSlide(e as number[])}
      />

      <TimerContainer>
        <input
          name="start"
          type="text"
          value={formatTime(startTimeMs)}
          onChange={e => handleTextChange(e.target)}
        />
        <input
          name="end"
          type="text"
          value={formatTime(endTimeMs)}
          onChange={e => handleTextChange(e.target)}
        />
      </TimerContainer>
    </Container>
  );
};

export default TimeSlider;
