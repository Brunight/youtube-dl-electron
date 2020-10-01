import React, { useState, useCallback, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { remote } from 'electron';
import { Link } from 'react-router-dom';
import fs from 'fs';
import CropperJS from 'cropperjs';

import Cropper from '../../components/Cropper';
import Button from '../../components/Button';

import { useToast } from '../../hooks/toast';

import { Container } from './styles';

const CropperPage: React.FC = () => {
  const [cropper, setCropper] = useState<CropperJS>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [canvas, setCanvas] = useState('');

  const { addToast } = useToast();

  useEffect(() => {
    document.title = 'Cropper';
  }, []);

  const handleCrop = useCallback(() => {
    if (typeof cropper !== 'undefined') {
      setCanvas(cropper.getCroppedCanvas().toDataURL());
    }
  }, [cropper]);

  const handleSave = useCallback(async () => {
    try {
      if (typeof cropper !== 'undefined') {
        cropper.getCroppedCanvas().toBlob(async (blob: Blob) => {
          const buffer = Buffer.from(await blob.arrayBuffer());

          const savePath = remote.dialog.showSaveDialogSync({
            defaultPath: 'cover.jpg',
            filters: [
              {
                name: 'Cover file',
                extensions: ['jpg'],
              },
            ],
          });
          if (savePath) {
            fs.writeFileSync(savePath, buffer);
            remote.shell.showItemInFolder(savePath);
          }
        });
      }
    } catch (err) {
      window.scrollTo(0, 0);
      addToast({
        title: 'Error!',
        description: err.toString(),
        type: 'error',
      });
      console.log(err);
    }
  }, [addToast, cropper]);

  return (
    <Container>
      <Cropper
        onInitialized={instance => {
          setCropper(instance);
        }}
        style={{ width: '100%' }}
        ready={() => setIsLoaded(true)}
      />
      {isLoaded && (
        <Button type="button" onClick={handleCrop} style={{ marginBottom: 16 }}>
          Crop
        </Button>
      )}

      {canvas !== '' && (
        <>
          <img src={canvas} alt="Canvas" style={{ width: '100%' }} />
          <Button
            type="button"
            onClick={handleSave}
            style={{ marginBottom: 16 }}
          >
            Save
          </Button>
        </>
      )}
      <Link to="/">
        <FiArrowLeft />
        Back
      </Link>
    </Container>
  );
};

export default CropperPage;
