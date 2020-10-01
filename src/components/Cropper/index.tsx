import React, { useState, useEffect } from 'react';
import Cropper, { ReactCropperProps } from 'react-cropper';
import isDev from 'electron-is-dev';
import 'cropperjs/dist/cropper.css';

import isValidURL from '../../utils/isValidUrl';
import defaultCover from '../../assets/default-cover.jpg';

export interface CropperProps extends ReactCropperProps {
  imgUrl?: string;
}

const Demo: React.FC<CropperProps> = ({ imgUrl = '', ...children }) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    if (imgUrl && imgUrl !== '') {
      setImage(imgUrl);
    } else setImage(defaultCover);
  }, [imgUrl]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  // const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // Having Cors problem
  //   setImage(
  //     isDev
  //       ? `http://cors-anywhere.herokuapp.com/${e.target.value}`
  //       : e.target.value,
  //   );
  //   if (onImageChange) onImageChange();
  // };

  const onTextPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const item = e.clipboardData.items[0];
    if (!item) return;
    if (item.type.indexOf('image') === 0) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(blob);
    }

    if (item.type.indexOf('text/plain') === 0) {
      item.getAsString(text => {
        if (isValidURL(text))
          setImage(isDev ? `http://cors-anywhere.herokuapp.com/${text}` : text);
      });
    }

    if (item.type.indexOf('text/html') === 0) {
      item.getAsString(text => {
        const parsedImage = text.split('<img src="')[1].split('"')[0];
        if (isValidURL(parsedImage))
          setImage(
            isDev
              ? `http://cors-anywhere.herokuapp.com/${parsedImage}`
              : parsedImage,
          );
      });
    }
  };

  return (
    <>
      <Cropper
        src={image}
        /* minCropBoxHeight={256}
        minCropBoxWidth={256} */
        initialAspectRatio={1}
        viewMode={1}
        guides
        autoCropArea={1}
        background={false}
        crossOrigin="anonymous"
        {...children}
      />

      <div style={{ marginTop: '8px', marginBottom: '8px' }}>
        <input
          type="file"
          onChange={onFileChange}
          style={{ fontSize: '14px' }}
        />
        <input
          type="text"
          onPaste={onTextPaste}
          style={{ marginLeft: '16px' }}
        />
      </div>
    </>
  );
};

export default Demo;
