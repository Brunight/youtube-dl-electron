import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory, Link } from 'react-router-dom';
import clipboardWatcher from 'electron-clipboard-watcher';
import { remote } from 'electron';
import { extname } from 'path';

import isValidURL from '../../utils/isValidUrl';
import youtubeGetId from '../../utils/youtubeGetId';
import Button from '../../components/Button';

import { Container, Content, Dropzone } from './styles';

import { useToast } from '../../hooks/toast';

import YoutubeSVG from '../../../assets/logo.svg';

const Dashboard: React.FC = () => {
  const [video, setVideo] = useState('');

  const history = useHistory();
  const extensions = useMemo(() => ['mp3', 'flac', 'm4a', 'wav'], []);

  const { addToast } = useToast();

  useEffect(() => {
    clipboardWatcher({
      // (optional) delay in ms between polls
      watchDelay: 1000,
      // handler for when text data is copied into the clipboard
      onTextChange(text: string) {
        if (isValidURL(text)) {
          const id = youtubeGetId(text);
          if (id !== text) {
            console.log(`Found video '${text}' on clipboard`);
            remote.getCurrentWindow().show();
            // remote.app.focus({
            //   steal: true,
            // });
            // watcher
            history.push(`/info/youtube/${id}`);
          }
        }
      },
    });
  }, [history]);

  useEffect(() => {
    if (isValidURL(video)) {
      const id = youtubeGetId(video);
      if (id !== video) history.push(`/info/youtube/${id}`);
    }
  }, [video, history]);

  const handleDropzoneDrop = useCallback(
    (e: DragEvent) => {
      if (e.dataTransfer) {
        const eventFiles = e.dataTransfer.files;

        if (eventFiles[0]) {
          if (extensions.includes(extname(eventFiles[0].path).replace('.', '')))
            history.push(`/info/file/${eventFiles[0].path}`);
          else
            addToast({
              title: 'Error!',
              description: `${eventFiles[0].name} is not an audio file.`,
              type: 'error',
            });
        }
      }
    },
    [history, extensions, addToast],
  );

  const handleDropzoneClick = useCallback(() => {
    const filePath = remote.dialog.showOpenDialogSync({
      filters: [
        {
          name: 'Audio file',
          extensions,
        },
      ],
    });
    if (filePath) history.push(`/info/file/${filePath}`);
  }, [history, extensions]);

  return (
    <>
      <Container>
        <Content>
          <YoutubeSVG width={256} />
          <h1>Download audio from YouTube</h1>
          <input
            placeholder="Ex: https://www.youtube.com/watch?v=bwfT9pDV_-4"
            onChange={e => setVideo(e.target.value)}
          />

          <Dropzone
            title="Edit music file metadata/tags"
            subtitle="Drop files here"
            onDrop={(e: DragEvent) => handleDropzoneDrop(e)}
            onClick={handleDropzoneClick}
          />
          <Link to="/cropper">
            <Button style={{ width: 150 }}>Cropper</Button>
          </Link>
        </Content>
      </Container>
    </>
  );
};

export default Dashboard;
