import React, { useState, useCallback } from 'react';

import { DropzoneContainer, Title, SubTitle } from './styles';

interface Props {
  title: string;
  subtitle: string;
  onDrop: (e: DragEvent) => void;
  onClick: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
}

const Dropzone: React.FC<Props> = ({ title, subtitle, onDrop, onClick }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.persist();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      switch (e.nativeEvent.code) {
        case 'Space': {
          onClick();
          break;
        }
        default: {
          break;
        }
      }
    },
    [onClick],
  );

  const onDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const onDropEvent = useCallback(
    (e: React.SyntheticEvent<HTMLDivElement>) => {
      e.preventDefault();
      // setIsDragging(true);
      if (onDrop) onDrop(e.nativeEvent as DragEvent);
      setIsDragging(false);
    },
    [onDrop],
  );

  return (
    <>
      <DropzoneContainer
        isDragging={isDragging}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDropEvent}
        onClick={onClick}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
      >
        <Title>{title}</Title>
        <SubTitle>{subtitle}</SubTitle>
      </DropzoneContainer>
    </>
  );
};

export default Dropzone;
